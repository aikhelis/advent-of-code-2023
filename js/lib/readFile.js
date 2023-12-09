const fs = require('fs');
const path = require('path');

function readFile(file) {
    return fs.readFileSync(path.resolve(file), 'utf8');
}

function readFileLines(file) {
    return readFile(file).split('\n');
}

module.exports = {readFile, readFileLines: readFileLines};