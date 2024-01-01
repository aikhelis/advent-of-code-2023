const {readFile} = require('../lib/readFile');
const testInput    = readFile('./js/13/test.txt');
const testInput2   = readFile('./js/13/test2.txt');
const puzzleInput  = readFile('./js/13/input.txt');

const parse = (lines) => lines.split('\n\n').map(a=>a.split('\n')).map(pattern => pattern.map(string => string.replaceAll('.', 0).replaceAll('#', 1)));

const isOutOfBounds = (i, length) => i<0 || i>=length;

const transpose = (listOfStrings) => {
    let matrix = listOfStrings.map(s => s.split(''));
    matrix = matrix[0].map((_, i) => matrix.map(row => row[i]));
    return matrix.map(row => row.join(''));
}

// <part 1>
const isAReflection = (array, indexL, indexR) => {
    if(isOutOfBounds(indexL, array.length) || isOutOfBounds(indexR, array.length)) return true;
    return array[indexL] === array[indexR] ? isAReflection(array, indexL-1, indexR+1) : false;
}

const indexOfHorizontalReflection = (listOfStrings, withSmudge) => {
    let reflectionFinder = withSmudge ? isAReflectionWithSmudge : isAReflection;
    for (let i = 1; i < listOfStrings.length; i++) {
        if(reflectionFinder(listOfStrings, i-1, i)) return i-1;
    }
    return -1;
}

const indexOfVetricalReflection = (listOfStrings, withSmudge) => indexOfHorizontalReflection(transpose(listOfStrings), withSmudge);

const reflectionScore = (pattern, withSmudge) => {
    // console.table(pattern);
    const index = indexOfHorizontalReflection(pattern, withSmudge);
    const score = (index > -1) ? (index + 1) * 100 : indexOfVetricalReflection(pattern, withSmudge) + 1;
    // console.log(score);
    return score;
}

// <part 2>
const countDifferences = (binary1, binary2) => (Number(`0b${binary1}`) ^ Number(`0b${binary2}`)).toString(2).split('').filter(c=>c==='1').length;

const isAReflectionWithSmudge = (array, indexL, indexR) => {
    if(isOutOfBounds(indexL, array.length) || isOutOfBounds(indexR, array.length)) return false;
    const diffs = countDifferences(array[indexL], array[indexR]);
    return diffs > 1 ? false : 
            diffs === 1 ? isAReflection(array, indexL-1, indexR+1) : 
                            isAReflectionWithSmudge(array, indexL-1, indexR+1);
}

const reflectionScoresCheckSum = (patterns, withSmudge) => patterns.reduce((sum, p) => sum + reflectionScore(p, withSmudge), 0);

// <main>
const input = puzzleInput;
const patterns = parse(input);
console.log(reflectionScoresCheckSum(patterns));
console.log(reflectionScoresCheckSum(patterns, true));
