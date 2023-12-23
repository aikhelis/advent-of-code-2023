const {readFileLines} = require('../lib/readFile');
const testInput   = readFileLines('./js/11/test.txt');
const puzzleInput = readFileLines('./js/11/input.txt');

const transpose = (matrix) => matrix[0].map((_, i) => matrix.map(row => row[i]));

class Galaxy {
    x; y; constructor(i, j) {this.x = i; this.y = j;}
}

const parse = (input) => input
    .map((line, i) => line.split('')
        .map((c, j) => c==='#' ? new Galaxy(i, j) : 0 ));

const isGalaxy = (x) => x!=0;
const isSpace = (x) => x==0;

function galaxies(grid, spaceMultiplier) {
    let galaxiesList = grid.flat().filter(isGalaxy).map(g => Object.assign({}, g));
    grid = transpose(grid); 
    for(let j = grid.length-1; j>=0; j--) {
        if (grid[j].every(isSpace)) 
        galaxiesList.forEach(g => g.y += (g.y > j) ? (spaceMultiplier-1) : 0);
    }
    grid = transpose(grid); 
    for(let i = grid.length-1; i>=0; i--) {
        if (grid[i].every(isSpace)) 
        galaxiesList.forEach(g => g.x += (g.x > i) ? (spaceMultiplier-1) : 0);
    }
    return galaxiesList;
}

const distanceAtoB = (a, b) => Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
const distancesAtoList = (a, list) => list.reduce((sum, b) => sum + distanceAtoB(a, b), 0);
const allPairsDistancesIn = (list) => list.reduce((sum, a, i) => sum + distancesAtoList(a, list.slice(i)), 0);

// < main >
const input = puzzleInput;
const universe = parse(input);
console.log( 'With x  2: ' + allPairsDistancesIn(galaxies(universe, 2)) ); //10289334
console.log( 'With x 1M: ' + allPairsDistancesIn(galaxies(universe, 1000000)) ); //649862989626
