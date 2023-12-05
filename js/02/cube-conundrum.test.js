const {isGamePossible, possibeGamesCheckSum, powerOfCubeSetsInGame, powerOfGamesCheckSum} = require('./cube-conundrum');
const {readFileAndSplitLines} = require('../lib/readFile');

test.each([
    ['Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green', true],
    ['Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue', true],
    ['Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red', false],
    ['Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red', false],
    ['Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green', true],
    ['Game 6: 6 red, 0 blue, 3 green; 2 blue, 1 red, 2 green', true],
    ['Game 7: red', false],
    ['Game 8:', false]
])("isGamePossible('%s') = %b", (string, boolean) => {
    expect(isGamePossible(string)).toBe(boolean);
});

test("possibeGamesCheckSum(test data) = 14", () => {
    const list = readFileAndSplitLines('./02/input/input.test.txt')
    expect(possibeGamesCheckSum(list)).toBe(14);
});

test("possibeGamesCheckSum(puzzle input) = 2369", () => {
    const list = readFileAndSplitLines('./02/input/input.txt')
    expect(possibeGamesCheckSum(list)).toBe(2369);
});

test.each([
    ['Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green', 48],
    ['Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue', 12],
    ['Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red', 1560],
    ['Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red', 630],
    ['Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green', 36],
    ['Game 6: 6 red, 0 blue, 3 green; 2 blue, 1 red, 2 green', 36],
    ['Game 7: red', 0],
    ['Game 8:', 0]
])("powerOfCubeSetsInGame('%s') = %i", (string, number) => {
    expect(powerOfCubeSetsInGame(string)).toBe(number);
});

test("powerOfGamesCheckSum(test data) = 2322", () => {
    const list = readFileAndSplitLines('./02/input/input.test.txt');
    expect(powerOfGamesCheckSum(list)).toBe(2322);
});

test("powerOfGamesCheckSum(puzzle input) = 66363", () => {
    const list = readFileAndSplitLines('./02/input/input.txt');
    expect(powerOfGamesCheckSum(list)).toBe(66363);
});