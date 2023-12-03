const gameCubes = new Map([
    ['red',   12],
    ['green', 13],
    ['blue',  14]
]);
//Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
const regexCapturingGameId = /Game (\d+)/;
const regexCapturingNumberOfCubes = / (?<number>\d+) (?<color>red|green|blue)/g;

function isGamePossible(gameString){
    let foundMatches = false;
    for (const match of gameString.matchAll(regexCapturingNumberOfCubes)) {
        foundMatches = true;
        const number = Number(match.groups.number), color = match.groups.color;
        if (number === NaN || number > gameCubes.get(color)) return false;
    };
    return foundMatches;
}

function possibeGamesCheckSum(inputArrayOfGameStrings) {
    return inputArrayOfGameStrings.reduce( 
        (acc, string) => {
            const gameID = Number(string.match(regexCapturingGameId)[1]);
            return isGamePossible(string) ? acc + gameID : acc;
        }, 0
    );
}

function powerOfCubeSetsInGame(gameString){
    let maxNumberOfCubes = new Map([['red', 0], ['green', 0], ['blue', 0]]);
    for (const match of gameString.matchAll(regexCapturingNumberOfCubes)) {
        const number = Number(match.groups.number), color = match.groups.color;
        if (number > maxNumberOfCubes.get(color)) {
            maxNumberOfCubes.set(color, number);
        }
    };
    let power = 1;
    maxNumberOfCubes.forEach( (value) => power *= value );
    return power;
}

function powerOfGamesCheckSum(inputArrayOfGameStrings) {
    return inputArrayOfGameStrings.reduce( 
        (acc, string) => acc + powerOfCubeSetsInGame(string), 0
    );
}

// console.log(powerOfGamesCheckSum(input)); //66363

module.exports = {isGamePossible, possibeGamesCheckSum, powerOfCubeSetsInGame, powerOfGamesCheckSum};
