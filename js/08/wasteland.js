const {readFileLines} = require('../lib/readFile');
const testInput    = readFileLines('./js/08/test.txt');
const testInput2   = readFileLines('./js/08/test2.txt');
const testInput3   = readFileLines('./js/08/test3.txt');
const puzzleInput  = readFileLines('./js/08/input.txt');

class Node {
    L; R;
    constructor(l, r) {this.L = l; this.R = r;}
}

function parse(lines){
    let map = {};
    input.forEach( line => {
        nodes = line.match( /^(\S{3}) = \((\S{3}), (\S{3})\)$/ );
        if(nodes) map[nodes[1]] = new Node(nodes[2], nodes[3]);  
    });
    return [lines[0], map];
}

function fromStartToEnd(instructions, map, startLabel, endLabelTrailing){
    console.log(`From ${startLabel} to ${endLabelTrailing}`);
    if(instructions.length === 0) {console.log('Missing instructions!'); return null;}
    let step = 0, label = startLabel;
    console.log(`first step ${step}: ${label} = {${map[label]['L']}, ${map[label]['R']}} - taking ${instructions[0]}`);
    while(true){
        const prevLabel = label;
        label = map[label][instructions[ step % instructions.length ]];
        if(label.endsWith(endLabelTrailing)) {
            console.log(`final step ${step}: ${prevLabel} = {${map[prevLabel].L}, ${map[prevLabel].R}} - taking ${instructions[step % instructions.length]}`);
            console.log(`stopping on step ${step++} at: ${label} = {${map[label].L}, ${map[label].R}} - looking ${instructions[step % instructions.length]}`);
            break;
        }
        step++;
    }
    console.log(`ran ${step} steps and iterated through instructions ${step / instructions.length} times`);
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
    const stepCounts = startLabels.map(label => fromStartToEnd(instructions, map, label, 'Z'));
    return leastCommonMultiple(stepCounts);
}


const input = puzzleInput;
const [instructions, map] = parse(input);
console.log('instructions length: ' + instructions.length);
console.log();
console.log('answer: ' + fromAAAtoZZZ());
console.log();
console.log('answer: ' + fromxxAToxxZ());
