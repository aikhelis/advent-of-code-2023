const {readFileLines} = require('../lib/readFile');
const testInput   = readFileLines('./js/09/test.txt').map( a => a.split(' ').map(Number) );
const puzzleInput = readFileLines('./js/09/input.txt').map( a => a.split(' ').map(Number) );

const is0 = (n) => (n===0);

function leftAndRightNumbersInSeq(seq) {
    let delta = seq.map((v, i, vector) => 
        (vector[i-1] === undefined) ? undefined : vector[i] - vector[i-1]
    );
    delta.forEach((v,i,vector) => {if(v===undefined) vector.shift()});
    const [left, right] = (delta.every(is0)) ? [0,0] : leftAndRightNumbersInSeq(delta);
    return [seq[0] - left, seq[seq.length-1] + right];
}

function leftAndRightCheckSum(input){
    return input.reduce((sum, line) => {
        const [left, right] = leftAndRightNumbersInSeq(line);
        return [sum[0]+left, sum[1]+right]; 
    }, [0,0]);
}


console.log( leftAndRightCheckSum(testInput) );
console.log( leftAndRightCheckSum(puzzleInput) );