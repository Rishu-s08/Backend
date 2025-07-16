const path = require('path');

console.log("directory path:", path.dirname(__filename));
console.log("file name:", path.basename(__filename));
console.log("extension:", path.extname(__filename));

const joinPath = path.join(__dirname, 'test', 'subfolder', 'file.txt');
console.log("join path:", joinPath);

const resolvePath = path.resolve(__dirname, 'test', 'subfolder', 'file.txt');
console.log("resolve path:", resolvePath);

const normalizePath = path.normalize('/home/user/documents/../pictures/..//photo.jpg');
console.log("normalized path:", normalizePath);