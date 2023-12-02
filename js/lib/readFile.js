const fs = require('fs');
const path = require('path');
function readFile(file) {
    return fs.readFileSync(path.resolve(file), 'utf8').split('\n');
}
module.exports = readFile;