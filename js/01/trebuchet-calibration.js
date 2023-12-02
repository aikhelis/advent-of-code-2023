const readFile = require("../lib/readFile");

function decipherCalibrationValueFromInputWithDigits(string){
    // trim all non numerical characters from the input
    let digits = string.replace(/[^\d]|0/g, '');
    // 0 if no numbers in the input
    return Number(digits[0] + digits[digits.length-1] || 0);
}

const decipherRegex = /[1-9]|one|two|three|four|five|six|seven|eight|nine/g;
const decipherMap = new Map([
    ['1', '1'], ['one',   '1'], 
    ['2', '2'], ['two',   '2'], 
    ['3', '3'], ['three', '3'], 
    ['4', '4'], ['four',  '4'], 
    ['5', '5'], ['five',  '5'], 
    ['6', '6'], ['six',   '6'],
    ['7', '7'], ['seven', '7'],
    ['8', '8'], ['eight', '8'],
    ['9', '9'], ['nine',  '9']
]);

function decipherCalibrationValue(string){
    match = string.match(decipherRegex);
    if(match == null) return 0;
    let firstNumber = decipherMap.get(match[0]), firstIndex = string.indexOf(match[0]);
    let lastNumber = firstNumber, lastIndex = firstIndex;
    decipherMap.forEach((value, key) => {
        let i = string.indexOf(key);
        let j = string.lastIndexOf(key);
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

function calibrationCheckSum(inputArrayOfStrings) {
    return inputArrayOfStrings.reduce( 
        (acc, string) => acc + decipherCalibrationValue(string), 0
    );
}

module.exports = {decipherCalibrationValue, calibrationCheckSum};