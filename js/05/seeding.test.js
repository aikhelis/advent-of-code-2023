const {parse, get_min_location_in_a_seed_list, get_min_location_in_seed_ranges, get_min_location_falling_into_seed_ranges} = require('./seeding');
const {readFile} = require('../lib/readFile');
const puzzleInput = readFile('./05/input.txt');
const testInput   = readFile('./05/test.txt');


test("get_min_location_in_a_seed_list(test data) = 35", () => {
    const [seeds] = parse(testInput);
    expect(get_min_location_in_a_seed_list(seeds)).toBe(35);
});

test("get_min_location_in_seed_ranges(test data) = 46", () => {
    const [, seedRanges] = parse(testInput);
    expect(get_min_location_in_seed_ranges(seedRanges)).toBe(46);
});

test("get_min_location_falling_into_seed_ranges(test data) = 46", () => {
    const [, seedRanges] = parse(testInput);
    expect(get_min_location_falling_into_seed_ranges(seedRanges)).toBe(46);
});

test("get_min_location_in_a_seed_list(puzzle input) = 389056265", () => {
    const [seeds] = parse(puzzleInput);
    expect(get_min_location_in_a_seed_list(seeds)).toBe(389056265);
});

// test("get_min_location_in_seed_ranges(puzzle input) = 137516820", () => {
//     const [, seedRanges] = parse(puzzleInput);
//     expect(get_min_location_in_seed_ranges(seedRanges)).toBe(137516820);
// });

// test("get_min_location_falling_into_seed_ranges(puzzle input) = 137516820", () => {
//     const [, seedRanges] = parse(puzzleInput);
//     expect(get_min_location_falling_into_seed_ranges(seedRanges)).toBe(137516820);
// });