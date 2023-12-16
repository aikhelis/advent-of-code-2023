const {readFileLines} = require('../lib/readFile');
const testInput   = readFileLines('./js/15/test.txt')[0].split(',');
const puzzleInput = readFileLines('./js/15/input.txt')[0].split(',');


const hash = (s) => s.split('')
                        .map(c => c.charCodeAt(0))
                            .reduce((hash, current) => 
                                        (hash + current) * 17 % 256, 0);
                        
const hashCheckSum = (listOfHashes) => 
                        listOfHashes.reduce(
                            (sum, next) => sum + next, 0);

class Lens {
    label; // letters
    fLength; // number 1..9
    constructor(l, f) {this.label = l; this.fLength = f}
}

class Box {
    lenses=[]; // array of Lenses

    remove(label) {
        this.lenses.forEach((elem, index, arr) => {
            if(elem.label === label) arr.splice(index, 1);
        });
    }
    
    add(label, fLength) {
        const replaced = this.lenses.find((elem, index) => {
            if(elem.label === label) { this.lenses[index].fLength = fLength; return true; }
        }) 
        if(!replaced) this.lenses.push(new Lens(label, fLength));
    }
}

class Facility {
    #boxes = []; // array of Boxes 0..255
    
    #apply(command) {
        const match = command.match(/(\w+)([-|=])(\d{0,1})/);
        if(!match) console.log(`Invalid command '${command}'`);
        const label = match[1], boxNumber = hash(label), operation = match[2], fLength = match[3];
    
        if(this.#boxes[boxNumber] === undefined) this.#boxes[boxNumber] = new Box();
        if(operation === '-') 
            this.#boxes[boxNumber].remove(label)
        else
            this.#boxes[boxNumber].add(label, fLength);
    }

    process (input) { input.forEach(c => this.#apply(c)) };

    get focusingPower() { 
        return this.#boxes.reduce((accBox, box, boxIndex) => 
            accBox + box.lenses.reduce((accLens, lens, lensIndex) => 
                accLens + (boxIndex+1) * (lensIndex+1) * lens.fLength, 
            0), 
        0); 
    }
}


let input = puzzleInput;

// part 1
const hashed = input.map(hash);
console.log('hash check sum: ' + hashCheckSum(hashed));

// part 2
const facility = new Facility();
facility.process(input);
console.log('focusing power: ' + facility.focusingPower);
