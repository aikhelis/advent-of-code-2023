"use strict"
const {readFileLines} = require('../lib/readFile');
const testInput    = readFileLines('./js/14/test.txt');
const puzzleInput  = readFileLines('./js/14/input.txt');

let grid; 
const parse = (lines) => lines.map(line=>line.split(''));

class Grid {
    #matrix; #height; #width; #cycle; 
    constructor(matrix){ this.#matrix = matrix; this.#height = matrix.length; this.#width = matrix[0].length; this.#cycle = -1; }
    get cycle() { return this.#cycle; }
    get hash() { return this.#matrix.reduce((s,row) => s + row.join(''), ''); }
    display() { 
        console.log('cycle', this.#cycle);
        this.#matrix.forEach(row => console.log(row.join(''))); 
        console.log(); 
    }
    
    #getRowValues(i) { return this.#matrix[i]; }
    #setRowValues(i, arr) { this.#matrix[i] = arr; }
    #getColumnValues(j) { return this.#matrix.map(row=>row[j]); }
    #setColumnValues(j, arr) { this.#matrix.forEach((_,i,matrix) => matrix[i][j] = arr[i]); }

    #moveRocksLeft(str) {
        const n = str.length; const rocks = str.match(/O/g);
        return rocks ? 'O'.repeat(rocks.length).padEnd(n, '.') : str;
    }
    #moveRocksRight(str) {
        const n = str.length; const rocks = str.match(/O/g);
        return rocks ? 'O'.repeat(rocks.length).padStart(n, '.') : str;
    }
    #moveRocksInArrayLeft(arrOfChars) { return arrOfChars.join('').split('#').map(this.#moveRocksLeft).join('#').split(''); }
    #moveRocksInArrayRight(arrOfChars){ return arrOfChars.join('').split('#').map(this.#moveRocksRight).join('#').split(''); }

    moveAllRocksNorth() {
        for (let j = 0; j < this.#width; j++) {
            let col = this.#getColumnValues(j);
            this.#setColumnValues(j, this.#moveRocksInArrayLeft(col));
        }
    }
    moveAllRocksSouth() {
        for (let j = 0; j < this.#width; j++) {
            let col = this.#getColumnValues(j);
            this.#setColumnValues(j, this.#moveRocksInArrayRight(col));
        }
    }
    moveAllRocksEast() {
        for (let i = 0; i < this.#height; i++) {
            let row = this.#getRowValues(i);
            this.#setRowValues(i, this.#moveRocksInArrayRight(row));
        }
    }
    moveAllRocksWest() {
        for (let i = 0; i < this.#height; i++) {
            let row = this.#getRowValues(i);
            this.#setRowValues(i, this.#moveRocksInArrayLeft(row));
        }
    }
    spin(iterations=1) {
        for (let i = 0; i < iterations; i++) {
            this.moveAllRocksNorth();
            this.moveAllRocksWest();
            this.moveAllRocksSouth();
            this.moveAllRocksEast();
            this.#cycle++;
        }
    }

    #getRowLoad(i) { 
        const rockLoad = this.#height - i;
        return rockLoad * this.#getRowValues(i).filter(c=>c=='O').length;
    }
    get totalLoad() { return this.#matrix.reduce((total, _, i) => total + this.#getRowLoad(i), 0);}
}

// <main>
// <part 1>
const input = testInput;
grid = new Grid(parse(input));
grid.moveAllRocksNorth();
console.log('part 1 answer:', grid.totalLoad);

// <part 2>
grid = new Grid(parse(puzzleInput));

const plannedCycles = 1000000000;
let hashHistory = [], loadHistory = [];

let indexOfFirstRepetitiveOccurance = -1;
for (let i = 0; i < plannedCycles; i++) {
    grid.spin();
    
    indexOfFirstRepetitiveOccurance = hashHistory.findIndex(record => record == grid.hash);
    if(indexOfFirstRepetitiveOccurance != -1){
        // console.log('history repeats itself:', grid.hash);
        // console.log('first occurance at cycle', indexOfFirstRepetitiveOccurance, 'next occurance at cycle', grid.cycle);
        break;
    }
    hashHistory.push(grid.hash);
    loadHistory.push(grid.totalLoad);
}

const prepCycles = indexOfFirstRepetitiveOccurance;
const plannedFinalCycle = plannedCycles - 1;
const cyclesPerLoop = grid.cycle - prepCycles;
const indexOfFirstFinalOccurance = (plannedFinalCycle - prepCycles) % cyclesPerLoop + prepCycles;
console.log('part 2 answer:', loadHistory[indexOfFirstFinalOccurance]);
