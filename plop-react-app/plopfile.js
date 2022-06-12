// plopfile.js
// 该文件是Plop的入口文件，需要导出一个函数，此函数接收一个plop对象，用于创建生成器任务

module.exports = plop => {
    //plop内部有一个成员函数setGenerator，接收两个参数，一为生成器的名字，二为生成器的配置。
    plop.setGenerator('component', {
        //在配置选项中需要指定一下生成器的描述
        description: 'create a component',
        //还可以在generator中用prompts数组指定generator工作时会发出的命令行问题
        prompts: [
            {
                type: 'input',  //用type去指定问题的输入方式
            	name: 'name',  //name去指定问题返回值的键
            	message: 'componet name',  //message是屏幕上的提示
            	default: 'MyComponent',  //default为问题的默认答案
            },
        ],
        //actions指定命令行交互过后需要执行的一些动作，可以为一个数组，数组中保存每一个动作对象
        actions: [
            {
                type:'add',  //用type属性去指定动作的类型，add代表添加文件
                path: 'src/components/{{name}}/{{name}}.js',
                templateFile: 'plop-templates/component.js.hbs'
            },
            {
                type:'add',  //用type属性去指定动作的类型，add代表添加文件
                path: 'src/components/{{name}}/{{name}}.css',
                templateFile: 'plop-templates/component.css.hbs'
            },
            {
                type:'add',  //用type属性去指定动作的类型，add代表添加文件
                path: 'src/components/{{name}}/{{name}}.test.js',
                templateFile: 'plop-templates/component.test.js.hbs'
            },
        ],
    });
    
}