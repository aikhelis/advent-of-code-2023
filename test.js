const {numberFromString, sumOfValues} = require('./task');
const readFile = require('../readFile');

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
    ['7oneight', 78],
    ['eightwothree', 83],
    ['eightwo', 82]
])("numberFromString('%s') = %i", (string, number) => {
    expect(numberFromString(string)).toBe(number);
});

test("E2E: sumOfValues = 228 & 807", () => {
    let list = readFile('day1/task1-test.txt')
    expect(sumOfValues(list)).toBe(228);
    list = readFile('day1/task2-test.txt')
    expect(sumOfValues(list)).toBe(807);
});

test("Final score: 54431", () => {
    let list = readFile('day1/task1-input.txt')
    expect(sumOfValues(list)).toBe(54431);
    list = readFile('day1/task2-input.txt')
    expect(sumOfValues(list)).toBe(54431);
});