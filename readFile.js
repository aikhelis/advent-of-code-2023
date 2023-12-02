const fs = require('fs');
function readFile(file) {
    return fs.readFileSync(file, 'utf8').split('\n');
}
module.exports = readFile;