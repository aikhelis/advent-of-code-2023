const {readFileLines} = require('../lib/readFile');
const testInput    = readFileLines('./js/18/test.txt');
const puzzleInput  = readFileLines('./js/18/input.txt');

class Direction {
    static R = 0; static D = 1; static L = 2; static U = 3;
    static 0 = 0; static 1 = 1; static 2 = 2; static 3 = 3;
}

class P {
    x;y; constructor(x, y) { this.x=x; this.y=y;};
    get info() {return `(${this.x}, ${this.y})`; }
}

class Edge {
    p1;p2; constructor(p1, p2) { this.p1 = p1; this.p2 = p2; }
    get minX() {return this.p1.x < this.p2.x ? this.p1.x : this.p2.x; }
    get minY() {return this.p1.y < this.p2.y ? this.p1.y : this.p2.y; }
    get maxX() {return this.p1.x > this.p2.x ? this.p1.x : this.p2.x; }
    get maxY() {return this.p1.y > this.p2.y ? this.p1.y : this.p2.y; }

    get length() { return Math.abs(this.maxX + this.maxY - this.minX - this.minY); }
    get determinant() { return (this.p1.x) * (this.p2.y) - (this.p1.y) * (this.p2.x); }

    contains(p) { return (this.minX <= p.x) && (this.maxX >= p.x) && (this.minY <= p.y) && (this.maxY >= p.y) }
}

function parse(lines, hex) {
    let points = [new P(0,0)]; 
    return lines.map((line, i) => {
        const match = line.match(/^([UDLR]) (\d+) \(\#(\w{5})(\d+)\)$/);
        let [dir, len, hexLen, intDir] = match.slice(1); 
        [dir, len] = hex ? [intDir, Number('0x'+hexLen)] : [dir, Number(len)];
        const p1 = points[i];
        const [x,y] = Direction[dir]=== 0 /*R*/ ? [p1.x + len, p1.y] :
                      Direction[dir]=== 1 /*D*/ ? [p1.x, p1.y + len] :
                      Direction[dir]=== 2 /*L*/ ? [p1.x - len, p1.y] :
                      Direction[dir]=== 3 /*U*/ ? [p1.x, p1.y - len] : 
                      console.log(`invalid direction ${dir}`);
        const p2 = new P(x, y); 
        points.push(p2);
        return new Edge(p1, p2);
    });
}
const parsePart1 = (lines) => parse(lines, false);
const parsePart2 = (lines) => parse(lines, true);

const shoelaceArea          = (edges) => Math.abs(edges.reduce((s, e) => s + e.determinant, 0) ) / 2;
const perimeterSquaresCount = (edges) => edges.reduce((s, e) => s + e.length, 0);
const innerSquaresCount     = (edges) => shoelaceArea(edges) - perimeterSquaresCount(edges)/2 + 1; //Pick's formula: Area = innerSquaresCount + perimeterSquaresCount/2 - 1
const coveredSquaresCount   = (edges) => innerSquaresCount(edges) + perimeterSquaresCount(edges); 


// complimentary: draw part 1 
const isDefined = (a) => a!==undefined;
const isUndefined = (a) => a===undefined;

let matrix;
function draw(edges){
    let points = edges.map(e=>e.p2);
    let minX = points.reduce((minx, p) => minx < p.x ? minx : p.x, points.at(0).x);
    let minY = points.reduce((miny, p) => miny < p.y ? miny : p.y, points.at(0).y);
    let maxX = points.reduce((maxx, p) => maxx > p.x ? maxx : p.x, points.at(0).x);
    let maxY = points.reduce((maxy, p) => maxy > p.y ? maxy : p.y, points.at(0).y);
    console.log(`min (x, y) = (${minX}, ${minY})`);
    console.log(`max (x, y) = (${maxX}, ${maxY})`);

    console.log(`Moving every point by (${-minX}, ${-minY})`);
    points = points.map(p => new P(p.x-minX, p.y-minY));
    edges = points.map((p,i,arr) => new Edge(arr.at(i-1), p));

    minX = points.reduce((minx, p) => minx < p.x ? minx : p.x, points.at(0).x);
    minY = points.reduce((miny, p) => miny < p.y ? miny : p.y, points.at(0).y);
    maxX = points.reduce((maxx, p) => maxx > p.x ? maxx : p.x, points.at(0).x);
    maxY = points.reduce((maxy, p) => maxy > p.y ? maxy : p.y, points.at(0).y);
    console.log(`min (x, y) = (${minX}, ${minY})`);
    console.log(`max (x, y) = (${maxX}, ${maxY})`);


    matrix = new Array(maxY+1);
    for (let y = 0; y <= maxY; y++) {
        matrix[y] = new Array(maxX+1);
        for (let x = 0; x <= maxX; x++) {
            if (edges.some(e => e.contains(new P(x,y)))) 
                matrix[y][x] = '#';
            else 
                matrix[y][x] = ' ';
        }
    }

    for (let i = 0; i <= maxX; i++) {
        for (let y = 0; y <= maxY; y++) {
            for (let x = 0; x <= maxX; x++) {
                if(shouldBeDot(y, x)) matrix[y][x] = '.';
            }
        }
    }

    console.log();
    for (let y = 0; y <= maxY; y++) console.log(matrix[y].join(''));
    console.log();

    let countDots = matrix.flat().filter(isDot).length;
    console.log(`Number of not covered squares = ${countDots}`);
    console.log(`Number of covered squares = ${(maxX+1)*(maxY+1)-countDots}`);
    console.log();
}

const neighbours = (y, x) => {
    let result = new Array(8);
    if(isDefined(matrix[y-1])){ result[0] = matrix[y-1][x-1]; result[1] = matrix[y-1][x]; result[2] = matrix[y-1][x+1]; }
    if(isDefined(matrix[y]))  { result[3] = matrix[y][x-1];   result[4] = matrix[y][x+1]; }
    if(isDefined(matrix[y+1])){ result[5] = matrix[y+1][x-1]; result[6] = matrix[y+1][x]; result[7] = matrix[y+1][x+1]; }
    return result;
}

const isDot = (p) => p==='.';

const shouldBeDot = (y, x) => {
    if( matrix[y][x] === '#' ) return false;
    if( neighbours(y, x).findIndex(isUndefined)>-1 ) return true;
    if( neighbours(y, x).findIndex(isDot)>-1 ) return true;
    return false;
}

// <main> 
const input = puzzleInput;

let edges = parsePart1(input);
console.log('Part 1');
// draw(edges);
console.log('area = ' + shoelaceArea(edges));
console.log('perimeter = ' + perimeterSquaresCount(edges));
console.log('number of covered squares = ' + coveredSquaresCount(edges));
console.log();

edges = parsePart2(input);
console.log('Part 2');
console.log('area = ' + shoelaceArea(edges));
console.log('perimeter = ' + perimeterSquaresCount(edges));
console.log('number of covered squares = ' + coveredSquaresCount(edges));
