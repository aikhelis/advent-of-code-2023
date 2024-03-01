const {readFileLines} = require('../lib/readFile');
const testInput    = readFileLines('./js/07/test.txt');
const puzzleInput  = readFileLines('./js/07/input.txt');

enum class Rank(value: Int): Comparable<Rank> {
    HIGH(4),
    ONE(5),
    TWO(6),
    THREE(7),
    BOAT(8),
    FOUR(9),
    FIVE(10)
}