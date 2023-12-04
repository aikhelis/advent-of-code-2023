function parseCardToTwoArrays(card) {
    // Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
    return card.replace(/Card[\s]+(\d+):/, '').split('|').map ( 
        arr => arr.match(/(\d+)/g)
    ) ?? [[],[]];
}

function cardPoints(card){
    let [arrA, arrB] = parseCardToTwoArrays(card);
    return arrA.reduce((count, v) => arrB.includes(v) ? ++count : count, 0);
}

function cardValue(card){
    let p = cardPoints(card);
    if (p===0) return 0;
    return 2**(p-1);
}

function scratchcardsValuesCheckSum(inputArrayOfCards) {
    return inputArrayOfCards.reduce( 
        (sum, card) => sum + cardValue(card), 0
    );
}

function allCardsPoints(inputArrayOfCards) {
    return inputArrayOfCards.map(cardPoints);
}

function scratchcardsTotalCount(inputArrayOfCards){
    const originalCount = inputArrayOfCards.length;
    const points = allCardsPoints(inputArrayOfCards);
    let counts = inputArrayOfCards.flat().fill(1);
    let total = 0;
    for (let i = 0; i < originalCount; i++) {
        total += counts[i];
        if (points[i]===0) continue;
        counts.splice(i+1, points[i], 
            ...counts.slice(i+1, i+points[i]+1).map(v=>v+counts[i])
        );
    }
    counts.length = originalCount;
    return total;
}

module.exports = {cardPoints, cardValue, scratchcardsValuesCheckSum, scratchcardsTotalCount};
