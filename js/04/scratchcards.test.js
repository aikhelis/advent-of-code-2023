const {cardPoints, cardValue, scratchcardsValuesCheckSum, scratchcardsTotalCount} = require('./scratchcards');
const {readFileAndSplitLines} = require('../lib/readFile');
const puzzleInput = readFileAndSplitLines('./04/input/input.txt');
const testInput   = readFileAndSplitLines('./04/input/input.test.txt');

const testCardPoints = [ 4, 2, 2, 1, 0, 0 ];
const testCardValues = [ 8, 2, 2, 1, 0, 0 ];
const cardPointsTests = testInput.map((card, i) => [card, testCardPoints[i]]);
const cardValueTests  = testInput.map((card, i) => [card, testCardValues[i]]);

test.each(cardPointsTests)("cardPoints('%s') = %i", (string, number) => {
    expect(cardPoints(string)).toBe(number);
});

test.each(cardValueTests)("cardValue('%s') = %i", (string, number) => {
    expect(cardValue(string)).toBe(number);
});

test("scratchcardsValuesCheckSum(test data) = 13", () => {
    expect(scratchcardsValuesCheckSum(testInput)).toBe(13);
});

test("scratchcardsValuesCheckSum(puzzle input) = 25651", () => {
    expect(scratchcardsValuesCheckSum(puzzleInput)).toBe(25651);
});

test("scratchcardsTotalCount(test data) = 30", () => {
    expect(scratchcardsTotalCount(testInput)).toBe(30);
});

test("scratchcardsTotalCount(puzzle input) = 19499881", () => {
    expect(scratchcardsTotalCount(puzzleInput)).toBe(19499881);
});