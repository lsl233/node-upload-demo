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
        form.encoding = 'utf-8';
        form.keepExtensions = true;
        form.parse(req, (err, fields, files) => {
            const fileArr = files.files;
            for (const file of fileArr) {
                const uploadedPath = file.path;
                const dstPath = './download/' + file.originalFilename;
                const readStream  = fs.createReadStream(uploadedPath);
                const writeStream = fs.createWriteStream(dstPath);
                readStream.pipe(writeStream);
                readStream.on('end', () => {
                    console.log('readStream end')
                })
            }
            ctx.body = 'success';
        });
    }
});

app.listen(3000);

console.info('node-upload-demo start, port:', 3000);
