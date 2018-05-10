const Koa = require('koa');
const koaStatic = require('koa-static');
const multiparty = require('multiparty');
const fs = require('fs');
const app = new Koa();

app.use(koaStatic('download'));

app.use(koaStatic('views'), {
    defer: true
});

function readFormData (req) {
    return new Promise((resolve, reject) => {
        const form = new multiparty.Form();
        form.encoding = 'utf-8';
        form.keepExtensions = true;
        form.parse(req, (err, fields, files) => {
            if (err) {
                reject(err);
            } else {
                resolve({fields, files});
            }
        })
    })
}

app.use(async ctx => {
    if (ctx.originalUrl === '/api/upload') {
        const {req} = ctx;
        const {fields, files} = await readFormData(req);
        const fileArr = files.files;
        console.log(fields);
        for (const file of fileArr) {
            const uploadedPath = file.path;
            const dstPath = './download/' + file.originalFilename;
            const readStream  = fs.createReadStream(uploadedPath);
            const writeStream = fs.createWriteStream(dstPath);
            readStream.pipe(writeStream);
            readStream.on('end', () => {
                console.log('readStream end')
            });
        }
        ctx.body = {status: 'done'};
    }
});

app.listen(3000);

console.info('node-upload-demo start, port:', 3000);
