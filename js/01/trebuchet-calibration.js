const readFile = require("../lib/readFile");

function decipherCalibrationValueFromInputWithDigits(cipheredString){
    // trim all non numerical characters from the input
    let digits = cipheredString.replace(/[^\d]|0/g, '');
    // 0 if no numbers in the input
    return Number(digits[0] + digits[digits.length-1] || 0);
}

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

function decipherCalibrationValue(cipheredString){
    let firstNumber = '', firstIndex = cipheredString.length; 
    let lastNumber = '', lastIndex = -1;
    decipherMap.forEach((value, key) => {
        const i = cipheredString.indexOf(key);
        const j = cipheredString.lastIndexOf(key);
        if (i >= 0 && i < firstIndex) {
            firstNumber = value; firstIndex = i;
        };
        if (j > lastIndex) {
            lastNumber = value; lastIndex = j;
        };
    });
    return Number(firstNumber + lastNumber);
}

function calibrationCheckSum(inputArrayOfStrings) {
    return inputArrayOfStrings.reduce( 
        (acc, string) => acc + decipherCalibrationValue(string), 0
    );
}

module.exports = {decipherCalibrationValue, calibrationCheckSum};
