const fs = require('fs');
const path = require('path');

function readFile(file) {
    return fs.readFileSync(path.resolve(file), 'utf8');
}

function readFileAndSplitLines(file) {
    return readFile(file).split('\n');
}

module.exports = {readFile, readFileAndSplitLines};