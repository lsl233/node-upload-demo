const Koa = require('koa');
const koaStatic = require('koa-static');
const multiparty = require('multiparty');
const fs = require('fs');
const util = require('util');
const app = new Koa();

app.use(koaStatic('views'), {
    defer: true
});

app.use(async ctx => {
    if (ctx.originalUrl === '/api/upload') {
        const {req} = ctx;
        const form = new multiparty.Form();
        form.encoding = 'utf-8'; // 编码
        form.keepExtensions = true; // 保留扩展名
        // form.maxFieldsSize = 2 * 1024 * 1024; // 文件大小
        // form.uploadDir='tmp';
        form.parse(req, function (err, fields, files) {
            const fileArr = files.files;
            for (const file of fileArr) {
                const uploadedPath = file.path;
                const dstPath = './' + file.originalFilename;
                const readStream  = fs.createReadStream(uploadedPath);
                const writeStream = fs.createWriteStream(dstPath);
                readStream.pipe(writeStream)
            }
        });
    }
});

app.listen(3000);