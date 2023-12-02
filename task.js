const readFile = require("../readFile");

function numberFromString1(string){
    let digits = string.replace(/[^\d]|0/g, '');
    return Number(digits[0] + digits[digits.length-1] || 0);
}

function numberFromString(input){
    const regex = /[1-9]|one|two|three|four|five|six|seven|eight|nine/g;
    const map = new Map([
        ['1','1'], ['one', '1'], 
        ['2', '2'], ['two', '2'], 
        ['3', '3'], ['three', '3'], 
        ['4', '4'], ['four', '4'], 
        ['5', '5'], ['five', '5'], 
        ['6', '6'], ['six', '6'],
        ['7', '7'], ['seven', '7'],
        ['8', '8'], ['eight', '8'],
        ['9', '9'], ['nine', '9']
    ]);
    
    match = input.match(regex);
    if(match == null) return 0;
    let firstNumber = map.get(match[0]), firstIndex = input.indexOf(match[0]);
    let lastNumber = firstNumber, lastIndex = firstIndex;
    map.forEach((value, key) => {
        let i = input.indexOf(key);
        let j = input.lastIndexOf(key);
        if (i > 0 && i <= firstIndex) {
            firstNumber = value; firstIndex = i;
        };
        if (j >= lastIndex) {
            lastNumber = value; lastIndex = j;
        };
    });
    // console.log('firstNumber: ' + Number(firstNumber));
    // console.log('lastNumber: ' + Number(lastNumber));
    return Number(firstNumber + lastNumber);
}

function sumOfValues(arrayOfStrings) {
    return arrayOfStrings.reduce( (acc, value) => acc + numberFromString(value), 0);
}

// console.log(sumOfValues(readFile('day1/task2-input.txt')));

module.exports = {numberFromString, sumOfValues};
