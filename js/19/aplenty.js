const {readFileLines} = require('../lib/readFile');
const testInput    = readFileLines('./js/19/test.txt');
const puzzleInput  = readFileLines('./js/19/input.txt');

// initial models
class Part {
    x;m;a;s; accepted;rejected;
    constructor(x,m,a,s) {this.x=Number(x); this.m=Number(m); this.a=Number(a); this.s=Number(s);}
    get info() { return `{x=${this.x}, m=${this.m}, a=${this.a}, s=${this.s}}`; }
    get score() { return this.accepted ? (this.x + this.m + this.a + this.s) : 0; }
    accept(){ this.accepted=true;  this.rejected=false; }
    reject(){ this.accepted=false; this.rejected=true;  }
    canSatisfy(condition) { return (condition===undefined) || condition.canPassFor(this[condition.key]); }
}

class Condition {
    key;operand;value;
    constructor(s) {
        const match = s.match(/^([xmas])([<>])(\d*)$/);
        if(!match){ console.log(`Invalid condition: '${condition}'`); return undefined; }
        [this.key, this.operand, this.value] = [ match[1], match[2], Number(match[3]) ];
    }
    get info(){return '' + this.key + this.operand + this.value; }
    get boundary() {return (this.operand==='<') ? (this.value - 1) : (this.value);}
    canPassFor(number) { return (this.operand==='<') ? (number < this.value) : (number > this.value); }
    canPassForRange(range) { return this.canPassFor(range.min) && this.canPassFor(range.max); }
    canSplitRange(range) { return this.canPassFor(range.min) !== this.canPassFor(range.max); }
 }

class Rule {
    condition; action;
    constructor(a, c) {
        this.action=a; 
        if(c!==undefined) this.condition = new Condition(c);
    }
    get info(){return this.condition ? `${this.condition.info}:${this.action}` : `${this.action}`}
}

class Workflow {
    name; rules;
    constructor(name, rules) {this.name=name; this.rules = rules;}
}

// range models
class Range {
    min;max;
    constructor(min,max){this.min=min; this.max=max;}
    get info(){return `${this.min}..${this.max}`;}
    get length(){return this.max - this.min + 1;}
    splitAt(boundary) {
        if(boundary < this.min || boundary >= this.max) {
            console.log(`Invalid boundary value ${boundary} for range ${this.info}`);
            return this;
        }
        return [new Range(this.min, boundary), new Range(boundary+1, this.max)];
    }
}

class PartsSet {
    x;m;a;s; accepted;rejected;split;
    wfName; ruleNum;
    constructor(xRange, mRange, aRange, sRange, wfName, ruleNum) {
        this.x=xRange; this.m=mRange; this.a=aRange; this.s=sRange; this.wfName = wfName; this.ruleNum = ruleNum;
    }
    get info() { return `{x=${this.x.info}, m=${this.m.info}, a=${this.a.info}, s=${this.s.info}} in ${this.wfName}[${this.ruleNum}]`; }
    get score() { return this.accepted ? this.x.length * this.m.length * this.a.length * this.s.length : 0; }
    accept(){ this.accepted=true;  this.rejected=false; }
    reject(){ this.accepted=false; this.rejected=true;  }
    canSatisfy(condition)  { return condition===undefined || condition.canPassForRange(this[condition.key]); }
    canBeSplitBy(condition){ return condition===undefined ? false : condition.canSplitRange(this[condition.key]); }
    splitBy(condition){
        if(!this.canBeSplitBy(condition)) {
            console.log(`cannot split as conditiion boundary is not splitting the range`);
            return [];
        }
        const newRanges = this[condition.key].splitAt(condition.boundary);
        const pSetL = new PartsSet(this.x, this.m, this.a, this.s, this.wfName, this.ruleNum);
        const pSetR = new PartsSet(this.x, this.m, this.a, this.s, this.wfName, this.ruleNum);
        pSetL[condition.key] = newRanges[0]; pSetR[condition.key] = newRanges[1]; 
        this.split = true;
        return [pSetL, pSetR];
    }
}

// <part1>
function partScoreInWorkflow(part, workflow) {
    for (const rule of workflow.rules) {
        if(part.canSatisfy(rule.condition)) {
            const name = rule.action;
            if(name==='A') { part.accept(); return part.score; } 
            else if(name==='R') { part.reject(); return part.score; } 
            else { return partScoreInWorkflow(part, WORKFLOWS.get(name)); }
        } 
    };
}

const acceptedPartsScoresCheckSum = () => 
    PARTS.reduce((sum, part) => sum + partScoreInWorkflow(part, WORKFLOWS.get('in')), 0);

// <part2>
function partsSetScore(pSet) {
    const wf = WORKFLOWS.get(pSet.wfName), rule = wf.rules[pSet.ruleNum], condition = rule.condition;
    if(pSet.canBeSplitBy(condition)){
        let [pSetL, pSetR] = pSet.splitBy(condition);
        return partsSetScore(pSetL) + partsSetScore(pSetR);
    }
    if(pSet.canSatisfy(condition)){
        const action = rule.action;
        if(action==='A') { pSet.accept(); return pSet.score; } 
        else if(action==='R') { pSet.reject(); return pSet.score; } 
        else { 
            pSet.wfName = action; pSet.ruleNum=0;
            return partsSetScore(pSet); 
        }
    } else {
        pSet.ruleNum++;
        return partsSetScore(pSet);
    }
}

function acceptablePartsScoresCheckSum() {
    const fullRange = new Range(1, 4000);
    const pSet = new PartsSet(fullRange, fullRange, fullRange, fullRange, 'in', 0);
    return partsSetScore( pSet );
}

// <main>
const defined = (x) => x !== undefined;

const parseParts = (lines) => 
    lines.map(line => {
        const match = line.match( /^\{x=(\d+),m=(\d+),a=(\d+),s=(\d+)\}$/ );
        return match ? new Part(...match.slice(1)) : undefined;  
    }).filter(defined);

function parseWorkflows(lines){
    let workflows = new Map();
    lines.forEach(line => {
        const match = line.match (/^([\w]+)\{(.+)\}$/ );
        if(match) {
            let [name, rules] = [ match[1], match[2] ];
            rules = rules.split(',').map( rule => new Rule(...rule.split(':').reverse()) );
            workflows.set(name, new Workflow(name, rules));
        }
    });
    return workflows;
}

const input = puzzleInput;
let [WORKFLOWS, PARTS] = [parseWorkflows(input), parseParts(input)];
console.log(acceptedPartsScoresCheckSum());
console.log(acceptablePartsScoresCheckSum());
