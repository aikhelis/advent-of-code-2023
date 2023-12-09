const {readFile} = require('../lib/readFile');
const puzzleInput = readFile('./js/03/input.txt');
const testInput   = readFile('./js/03/test.txt');
let input = puzzleInput;

let partNumbers = [];
let gears = [];
const numbersCapturingRegex = /(\d+)/g;
const n = input.match('\n').index;
// console.log('length: ', n);
input = input.replaceAll('\n','');
const matches = input.matchAll(numbersCapturingRegex);

// console.log('Numbers:')
for (const match of matches) {
    let number = {  value: match[0], 
                    start: match.index, 
                    end: match.index + match[0].length - 1 };
    // console.log(number);
    if(isPartNumber(number)) partNumbers.push(number);
    // if(isAdjacentToGear(number)) console.log('found gear near ', number);
}
// console.log('Part numbers:');
// console.log(partNumbers);

console.log('SUM: ', partNumbers.reduce((s, v) => s + Number(v.value), 0));

function isPartNumber(number){
    let found = false;
    for(let i = number.start; i <= number.end; i++) {
        if(isAdjacent(i)) return true;
    }
    return false;
}

function isAdjacent(i){
    return [i-n-1, i-n, i-n+1, i-1, i+1, i+n-1, i+n, i+n+1].some((j) => {
            if (j>= 0 && j<input.length) return input[j].match(/[^\d\.\n]/);
    })
}

function adjacentGear(i, number){
    [i-n-1, i-n, i-n+1, i-1, i+1, i+n-1, i+n, i+n+1].some((j) => {
            if (j>= 0 && j<input.length) {
                let match = input[j]==='*';
                if(match) gears.push({index: j, value: number});
            }
    })
}

function isAdjacentToGear(number) {
    let found = false;
    for(let i = number.start; i <= number.end; i++) {
        if(adjacentGear(i, Number(number.value))) return true;
    }
    return false;
}

// console.log('Gears: ');
// console.log(gears);