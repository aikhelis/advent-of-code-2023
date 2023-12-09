const {readFileLines} = require('../lib/readFile');
const testInput    = readFileLines('./js/08/test.txt');
const testInput2   = readFileLines('./js/08/test2.txt');
const testInput3   = readFileLines('./js/08/test3.txt');
const puzzleInput  = readFileLines('./js/08/input.txt');

function parse(lines){
    let map = {};
    input.forEach( line => {
        nodes = line.match( /^(\S{3}) = \((\S{3}), (\S{3})\)$/ );
        if(nodes) map[nodes[1]] = {L: nodes[2], R: nodes[3]};  
    });
    return [lines[0], map];
}

function fromStartToEnd(instructions, map, startLabel, endLabelTrailing){
    console.log(`From ${startLabel} to ${endLabelTrailing}`);
    let step = 0;
    let label = startLabel;
    while(true){
        if(instructions.length === 0) {console.log('Missing instructions!'); break;}
        if(label.endsWith(endLabelTrailing)) {console.log(`step ${step}, label ${label}`); break;}
        label = map[label][instructions[ step % instructions.length ]];
        step++;
    }
    return step;
}

function leastCommonMultiple(numbers){
    let i;
    for (i = 1; numbers.some(n => numbers[0] * i % n != 0); i++) {};
    return numbers[0] * i;
}

const fromAAAtoZZZ = () => fromStartToEnd(instructions, map, 'AAA', 'ZZZ');

function fromxxAToxxZ(){
    let startLabels = Object.keys(map).filter(label => label.endsWith('A'));
    const stepCounts = startLabels.map(label => fromStartToEnd(instructions, map, label, 'Z'))
    return leastCommonMultiple(stepCounts);
}


const input = puzzleInput;
const [instructions, map] = parse(input);
console.log(fromAAAtoZZZ());
console.log(fromxxAToxxZ());



