// generators/app/index.js
// 我们还是和之前一样用require载入yeoman-generator这个基类
const Generator = require('yeoman-generator')

// 然后导出一个继承自generator的类
module.exports = class extends Generator {
  //在这个类中定义一个prompting方法，用于以命令行交互的方式询问用户一些问题
  prompting () {
    return this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        default: this.appname
      }
    ]) 
    .then(answers => {
      this.answers = answers
    })
  }

  writing () {
    // 但这时的writing方法不再像之前只是写入单个文件，而是需要把提前准备好的文件批量生成。
    // 所以我们要先去准备一个templates目录，把项目的具体结构拷贝到templates中作为模板。
    // 有了模板之后我们就需要把项目结构里可能会发生变化的地方通过模板引擎语法的方式“挖坑”。
    // 因这里我们只在prompting里接收了名称，所以把能替换项目名称的地方都换为对应的EJS模板标记。
    // 在替换完模板之后，我们需要一个个地生成每一个文件到对应的目标路径中去。
    // 这里我们可以先把templates文件夹下的所有文件先以相对路径的形式放到一个数组中。
    // 再以数组循环的方式遍历每一个路径，从而为每一个模板生成他在目标目录中的对应文件。

    const templates = [
      '.browserslistrc',
      '.editorconfig',
      '.env.development',
      '.env.production',
      '.eslintrc.js',
      '.gitignore',
      'babel.config.js',
      'package.json',
      'postcss.config.js',
      'README.md',
      'public/favicon.ico',
      'public/index.html',
      'src/App.vue',
      'src/main.js',
      'src/router.js',
      'src/assets/logo.png',
      'src/components/HelloWorld.vue',
      'src/store/actions.js',
      'src/store/getters.js',
      'src/store/index.js',
      'src/store/mutations.js',
      'src/store/state.js',
      'src/utils/request.js',
      'src/views/About.vue',
      'src/views/Home.vue'
    ]

    templates.forEach(item => {
      // item => 每个文件路径
      this.fs.copyTpl(
        this.templatePath(item),
        this.destinationPath(item),
        this.answers
      )
    })
  }
}