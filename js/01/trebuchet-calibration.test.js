const {decipherCalibrationValue, calibrationCheckSum} = require('./trebuchet-calibration');
const {readFileAndSplitLines} = require('../lib/readFile');
const testInput = readFileAndSplitLines('./01/test.txt');
const puzzleInput = readFileAndSplitLines('./01/input.txt');

test.each([
    ['12', 12],
    ['1abc2', 12],
    ['pqr3stu8vwx', 38],
    ['a1b2c3d4e5f', 15],
    ['treb7uchet', 77],
    ['abcdef', 0],
    ['1234567890', 19],
    ['05', 55],
    ['', 0],
    ['two1nine', 29],
    ['eightwothree', 83],
    ['abcone2threexyz', 13],
    ['xtwone3four', 24],
    ['4nineeightseven2', 42],
    ['zoneight234', 14],
    ['7pqrstsixteen', 76],
    ['sfasfasfdfdfdafdaffiveleven', 55],
    ['fouronevzkbnzm6seven47', 47],
    ['zphgdcznqsm2', 22],
    ['4gjnmxtrbflgp71', 41],
    ['4sqvv1cnpn', 41],
    ['8sevengzfvjrhnsb6ddb8ninerkgkxthtfkvbcmqs', 89],
    ['1seven336', 16],
    ['86one34vvvgdngbt39', 89],
    ['eightwothree', 83],
    ['7oneight', 78],
    ['eightwo', 82]
])("decipherCalibrationValue('%s') = %i", (string, number) => {
    expect(decipherCalibrationValue(string)).toBe(number);
});

test("calibrationCheckSum(test data) = 807", () => {
    expect(calibrationCheckSum(testInput)).toBe(807);
});

test("calibrationCheckSum(puzzle input) = 54431", () => {
    expect(calibrationCheckSum(puzzleInput)).toBe(54431);
});