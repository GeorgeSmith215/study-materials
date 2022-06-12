const { src, dest, parallel, series, watch } = require('gulp')
const sass = require('gulp-sass')(require('sass'));
const loadPlugins = require('gulp-load-plugins')
const plugins = loadPlugins()

const del = require('del')
const browserSync = require('browser-sync')
const bs = browserSync.create()

// 样式编译
const style = () => {
    return src('src/assets/style/*.scss', { base:'src' })
    .pipe(sass({ outputStyle: 'expanded' }))
    // style任务执行后还需要useref去合并、压缩相关的引用文件，所以需要转换后放到temp目录下
    .pipe(dest('temp'))
    .pipe(bs.reload({ stream: true }))
}

// 脚本编译
const script = () => {
    return src('src/assets/scripts/*.js', { base: 'src' })
    .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
    // 和style类似，需要转换后放到temp目录下
    .pipe(dest('temp'))
    .pipe(bs.reload({ stream: true }))
}

// 提供给模板使用的数据
const data = {
  menus: [
    {
      name: 'Home',
      icon: 'aperture',
      link: 'index.html'
    },
    {
      name: 'Features',
      link: 'features.html'
    },
    {
      name: 'About',
      link: 'about.html'
    },
    {
      name: 'Contact',
      link: '#',
      children: [
        {
          name: 'Home',
          link: 'https://dipcheese.com'
        },
        {
          name: 'divider'
        },
        {
          name: 'About',
          link: 'https://github.com/GeorgeSmith215'
        }
      ]
    }
  ],
  pkg: require('./package.json'),
  date: new Date()
}

// 页面模板编译
const page = () => {
    return src('src/*.html', { base:'src' })
    .pipe(plugins.swig({ data, defaults: { cache: false } }))
    // 和style类似，需要转换后放到temp目录下
    .pipe(dest('temp'))
    .pipe(bs.reload({ stream: true }))
}

//图像与字体转换压缩
const image = () => {
    return src('src/assets/images/**', { base: 'src' })
    .pipe(plugins.imagemin())
    // image任务并不需要用到useref而只在build时做相关转换所以可以不用放到temp下
    .pipe(dest('dist'))
}
const font = () => {
    return src('src/assets/fonts/**', { base: 'src' })
    .pipe(plugins.imagemin())
    // 和image任务类似，不需要放到temp下
    .pipe(dest('dist'))
}

// 拷贝public目录下的文件及其子目录文件
const extra = () => {
    return src('public/**', { base: 'public' })
    // 和image任务类似，不需要放到temp下
    .pipe(dest('dist'))
}

// 清除dist目录
const clean = () => {
    // 在clean任务中可以加一个temp目录去清空中间文件所在目录
    return del(['dist', 'temp'])
}

// 开发服务器启动任务
const serve = () => {
    watch('src/assets/styles/*.scss', style)
    watch('src/assets/scripts/*.js', script)
    watch('src/*.html', page)
    watch([
        'src/assets/images/**',
        'src/assets/fonts/**',
        'public/**'
    ], bs.reload)

    bs.init({
        server: {
            // 因为在style，script，html任务(compile)执行后生成的文件都在temp下，
            // 所以在baseDir中就应该去temp中找对应的文件了，
            // 而dist目录只是我们最终需要上线打包的目录
            baseDir: ['temp', 'src', 'public'],
            routes: {
                '/node_modules': 'node_modules',
            }
        },
        notify: false,
        port: 8888,
        //open: false,
        //files: 'dist/**'
    })
}

const useref = () => {
    // 在useref中我们需要从temp中去取文件，并把最终的结果放到dist里
    return src('temp/*.html', { base: 'temp' })
    .pipe(plugins.useref({ searchPath: ['temp', '.'] }))
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    .pipe(plugins.if(/\.html$/, plugins.htmlmin({
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
    })))
    .pipe(dest('dist'))
    
}

// compile相当于每次构建前的子任务
const compile = parallel(style, script, page)

// build任务专门用于上线前的构建，最大化性能
// 最后useref还应该放到我们的组合任务中去使用，注意useref必须要放在compile之后，
// 所以compile和useref应该是一个串行的结构
const build = series(clean, parallel(series(compile, useref), image, font, extra))

// develop任务，用于开发时使用，最小化构建时间
// 注意develop和dist没有关系，他只是生成temp下的临时文件并通过serve找temp下的文件
const develop = series(compile, serve)

module.exports = {
    compile,
    build,
    develop,
    useref,
}