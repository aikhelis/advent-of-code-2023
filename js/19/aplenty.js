const {readFileLines} = require('../lib/readFile');
const testInput    = readFileLines('./js/19/test.txt');
const puzzleInput  = readFileLines('./js/19/input.txt');

// initial models
class Part {
    x;m;a;s; accepted;rejected;
    constructor(x,m,a,s) {this.x=Number(x); this.m=Number(m); this.a=Number(a); this.s=Number(s);}
    get info() { return `{x=${this.x}, m=${this.m}, a=${this.a}, s=${this.s}}`; }
    accept(){ this.accepted=true;  this.rejected=false; }
    reject(){ this.accepted=false; this.rejected=true;  }
    satisfies(condition) {
        return (condition===undefined) || condition.passesFor(this[condition.key]);
    }
    get score() { 
        if (this.accepted) return this.x + this.m + this.a + this.s; 
        else return 0;
    }
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
    passesFor(number) { return (this.operand==='<') ? (number < this.value) : (number > this.value); }
    passesForRange(range) { return this.passesFor(range.min) && this.passesFor(range.max); }
    splitsRange(range) { return this.passesFor(range.min) !== this.passesFor(range.max); }
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
    split(boundary) {
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
    accept(){ this.accepted=true;  this.rejected=false; }
    reject(){ this.accepted=false; this.rejected=true;  }

    canBeSplitBy(condition){
        if(condition===undefined) return false;
        return condition.splitsRange(this[condition.key]);
    };
    splitBy(condition){
        if(!this.canBeSplitBy(condition)) {
            console.log(`cannot split as conditiion boundary is not splitting the range`);
            return [];
        }
        let i; switch (condition.key) {
            case 'x': i=0; break;
            case 'm': i=1; break;
            case 'a': i=2; break;
            case 's': i=3; break;
        }
        const newRanges = this[condition.key].split(condition.boundary);
        let newXmasL = [this.x, this.m, this.a, this.s]; newXmasL[i] = newRanges[0];
        let newXmasR = [this.x, this.m, this.a, this.s]; newXmasR[i] = newRanges[1];
        const newPSetL = new PartsSet(...newXmasL, this.wfName, this.ruleNum);
        const newPSetR = new PartsSet(...newXmasR, this.wfName, this.ruleNum);
        this.split = true;
        return [newPSetL, newPSetR];
    }
    satisfies(condition) {
        return (condition===undefined) || condition.passesForRange(this[condition.key]);
    }
    get score() { 
        const s = this.accepted ? this.x.length * this.m.length * this.a.length * this.s.length : 0;
        // console.log(`SCORE of ${this.info} = ${s}`);
        return s;
    }
}

// <part1>
function runWorkflow(workflow, part) {
    let name = workflow.name;
    for (const rule of workflow.rules) {
        if(part.satisfies(rule.condition)) {
            name = rule.action;
            if(name==='A') { part.accept(); return true; } 
            else if(name==='R') { part.reject(); return false; } 
            else { return runWorkflow(WORKFLOWS.get(name), part); }
        } 
    };
}

function acceptedPartsRatingCheckSum(){
    return PARTS.reduce((sum, part) => {
        runWorkflow(WORKFLOWS.get('in'), part);
        return sum + part.score;
    }, 0);
}

// <part2>
function processPartsSet(pSet) {
    const wf = WORKFLOWS.get(pSet.wfName);
    const rule = wf.rules[pSet.ruleNum];
    const condition = rule.condition;
    // console.log(`processing set ${pSet.info} with rule ${rule.info}`);
    if(pSet.canBeSplitBy(condition)){
        // console.log(`splitting ${pSet.info} at ${condition.key}=${condition.boundary}`);
        let [pSetL, pSetR] = pSet.splitBy(condition);
        return processPartsSet(pSetL) + processPartsSet(pSetR);
    }
    if(pSet.satisfies(condition)){
        const action = rule.action;
        if(action==='A') { pSet.accept(); return pSet.score; } 
        else if(action==='R') { pSet.reject(); return pSet.score; } 
        else { 
            pSet.wfName = action; pSet.ruleNum=0;
            return processPartsSet(pSet); 
        }
    } else {
        pSet.ruleNum++;
        return processPartsSet(pSet);
    }
}

function acceptablePartsCheckSum() {
    const fullRange = new Range(1, 4000);
    const pSet = new PartsSet(fullRange, fullRange, fullRange, fullRange, 'in', 0);
    return processPartsSet( pSet );
}

// <main>
function parse(lines){
    let workflows=new Map(), parts=[];
    input.forEach( line => {
        const matchPart = line.match( /^\{x=(\d+),m=(\d+),a=(\d+),s=(\d+)\}$/ );
        if(matchPart) parts.push( new Part(...matchPart.slice(1)) );  

        const workflowMatch = line.match (/^([\w]+)\{(.+)\}$/ );
        if(workflowMatch) {
            let [name, rules] = [ workflowMatch[1], workflowMatch[2] ];
            rules = rules.split(',').map( rule => new Rule(...rule.split(':').reverse()) );
            workflows.set(name, new Workflow(name, rules));
        }
    });
    return [workflows, parts];
}

const input = puzzleInput;
let [WORKFLOWS, PARTS] = parse(input);
console.log(acceptedPartsRatingCheckSum());
console.log(acceptablePartsCheckSum());
