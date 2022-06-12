// gulpfile.js
const fs = require('fs');
// 导入stream中的transform类
const { Transform } = require('stream');

exports.default = () => {
    const read = fs.createReadStream('normalize.css');
    const write = fs.createWriteStream('normalize.min.css');
    // 通过transform类去new一个文件转换流对象
    const transform = new Transform({
        //在transform中需要指定一个transform属性，是转换流的核心转换过程
        transform: (trunk, encoding, callback) => {
            //可以通过函数中的trunk拿到文件读取流中读取到的文件内容(Buffer)
            //因为trunk中保存的是字节数组，所以要再用toString方法把trunk转换为字符串
            const input = chunk.toString();
            //之后在input中就是对应的文本内容了，我们可以用replace把空白字符以及注释都先替换掉
            const output = input.replace(/\s+/, '').replace(/\/*.+?\*\//g, '');
            //最后我们再在callback中将output返回出去，而output就会作为转换完的结果接着往后导出
            //另外还需要注意callback是错误优先的函数，第一个参数应该传入错误对象，如果没有错误可以传null
            callback(null, output);
        }
    })
    //在pipe到write流之前先pipe到transform流里去进行转换
    read.pipe(transform)
        .pipe(write);
    return read;
}