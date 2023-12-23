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

const galaxiesIn = (grid) => grid.flat().filter(isGalaxy).map(g => g);

function moveApart(galaxies, grid, multiplier) {
    let listOfGalaxies = Array.from(galaxies);
    grid = transpose(grid); 
    for(let j = grid.length-1; j>=0; j--) {
        if (grid[j].every(isSpace)) 
            listOfGalaxies.forEach(g => g.y > j ? g.y += (multiplier-1) : g.y)
    }
    grid = transpose(grid); 
    for(let i = grid.length-1; i>=0; i--) {
        if (grid[i].every(isSpace)) 
            listOfGalaxies.forEach(g => g.x > i ? g.x += (multiplier-1) : g.x)
    }
    return listOfGalaxies;
}

const distanceAtoB = (a, b) => Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
const distancesAtoList = (a, list) => list.reduce((sum, b) => sum + distanceAtoB(a, b), 0);
const allPairsDistancesIn = (list) => list.reduce((sum, a, i) => sum + distancesAtoList(a, list.slice(i)), 0);

// < main >
const input = puzzleInput;
let universe, galaxies;

universe = parse(input);
galaxies  = allPairsDistancesIn(moveApart(galaxiesIn(universe), universe, 2));
console.log('With x  2: ' + galaxies); //10289334

universe = parse(input);
galaxies = allPairsDistancesIn(moveApart(galaxiesIn(universe), universe, 1000000));
console.log('With x 1M: ' + galaxies); //649862989626
