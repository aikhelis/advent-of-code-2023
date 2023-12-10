const seedsParserRegex = /seeds: ([\d ]+)/;
const parserMapsRegex = /(?<name>\w+-to-\w+) map:\n(?<mappings>(?:\d+ \d+ \d+(?:\n|$))*)/g;

const isInRange = (x, range) => x >= range.start && x <= range.end;

class Range {
    start; length; end; //numbers
    constructor(s, l, e) {this.start = s; this.end = e; this.length = l;}
}

class RangeMapping {
    destination; source; //numbers
    constructor(d, s, l) {
        this.destination = new Range(d, l, d+l-1);
        this.source = new Range(s, l, s+l-1);
    }
}

const AlmanacMaps = {
    'seed-to-soil':             [new RangeMapping()],
    'soil-to-fertilizer':       [new RangeMapping()],
    'fertilizer-to-water':      [new RangeMapping()],
    'water-to-light':           [new RangeMapping()],
    'light-to-temperature':     [new RangeMapping()],
    'temperature-to-humidity':  [new RangeMapping()],
    'humidity-to-location':     [new RangeMapping()]
}

function parse(input){
    // seeds
    const seeds = input.match(seedsParserRegex)[1].split(' ').map(Number);
    // console.log('seeds: ', seeds);
    // seed ranges
    let starts = [], lengths = [];
    seeds.forEach((s, i) => { i % 2 ? lengths.push(s) : starts.push(s) });
    const seedRanges = starts.map((start, i) => {
        return new Range(start, lengths[i], start + lengths[i] - 1);
    }).sort((a,b) => a.start - b.start);
    // console.log('seed ranges: ', seedRanges);

    // range mappings
    // match all groups of mappings: seed-to-soil, soil-to-fertilizer, etc
    for (const match of input.matchAll(parserMapsRegex)) {
        // get all mapping lines for a group, ditch a blank line
        let mappingLines = match.groups.mappings.split('\n').filter(x=>x!='');
        // construct a sorted list of RangeMappings for each group
        AlmanacMaps[match.groups.name] = mappingLines
            .map(mapping => mapping.split(' ').map(Number))
            .map(mapping => new RangeMapping(mapping[0], mapping[1], mapping[2]) )
            .sort((rm1,rm2) => rm1.source.start - rm2.source.start);
    };
    // console.log(AlmanacMaps);

    // return input seeds and seed ranges for further expicit action
    return [seeds, seedRanges];
}

function getDestinationForSource(rangeMappings, source){
    const mapping = rangeMappings.find( map => isInRange(source, map.source) );
    return mapping ? mapping.destination.start + source - mapping.source.start : source;
}

function getSourceForDestination(rangeMappings, destination){
    const mapping = rangeMappings.find( map => isInRange(destination, map.destination) );
    return mapping ? mapping.source.start + destination - mapping.destination.start : destination;
}

function get_location_for_seed(seed) {
    return  getDestinationForSource(AlmanacMaps['humidity-to-location'], 
                getDestinationForSource(AlmanacMaps['temperature-to-humidity'], 
                    getDestinationForSource(AlmanacMaps['light-to-temperature'], 
                        getDestinationForSource(AlmanacMaps['water-to-light'], 
                            getDestinationForSource(AlmanacMaps['fertilizer-to-water'], 
                                getDestinationForSource(AlmanacMaps['soil-to-fertilizer'], 
                                    getDestinationForSource(AlmanacMaps['seed-to-soil'], seed)
                                )
                            )
                        )
                    )
                )   
            );
}

function get_seed_for_location(location){
    return  getSourceForDestination(AlmanacMaps['seed-to-soil'], 
                getSourceForDestination(AlmanacMaps['soil-to-fertilizer'], 
                    getSourceForDestination(AlmanacMaps['fertilizer-to-water'], 
                        getSourceForDestination(AlmanacMaps['water-to-light'], 
                            getSourceForDestination(AlmanacMaps['light-to-temperature'], 
                                getSourceForDestination(AlmanacMaps['temperature-to-humidity'], 
                                    getSourceForDestination(AlmanacMaps['humidity-to-location'], location)
                                )
                            )
                        )
                    )
                )
            );
}

const minOfWithUndefined = (currentCanBeUndefined, next) => currentCanBeUndefined < next ? currentCanBeUndefined : next;

function get_min_location_in_a_seed_list(seeds) {
    return seeds.reduce((min, seed) => {
        const nextLocation = get_location_for_seed(seed);
        return minOfWithUndefined(min, nextLocation);
    });
}

function get_min_location_in_a_seed_range(range) {
    // console.log('get_min_location_in_a_seed_range');
    let min;
    for (let seed = range.start; seed <= range.end; seed++) {
        const nextLocation = get_location_for_seed(seed);
        min = minOfWithUndefined(min, nextLocation);
    }
    // console.log('min location: ', min);
    return min;
}

//puzzle input run time on Intel macpro 2019 ~ 551.552 seconds (9mins)
function get_min_location_in_seed_ranges(seedRanges) {
    // console.log('get_min_location_in_seed_ranges');
    let min;
    seedRanges.forEach(range => {
        const minInRange = get_min_location_in_a_seed_range(range);
        min = minOfWithUndefined(min, minInRange);
    });
    // console.log('min location: ', min);
    return min;
}

function get_min_location_falling_into_seed_ranges(seedRanges){
    // console.log('get_min_location_falling_into_seed_ranges. seed ranges: ', seedRanges);
    let i = 0;
    while(true){
        let seed = get_seed_for_location(i);
        // console.log(`get_min_location_falling_into_seed_ranges. location (${i}) - seed (${seed})`);
        if( seedRanges.find( r => isInRange(seed, r) ) ) {
            // console.log(`get_min_location_falling_into_seed_ranges. Location falling into our ranges (${i}) - seed (${seed})`);
            return i;
        }
        i++;
    }
}

// const {readFile} = require('../lib/readFile');
// const testInput = readFile('./js/05/test.txt');
// const puzzleInput = readFile('./js/05/input.txt');
// [seeds, seedRanges] = parse(puzzleInput);

// console.log(get_min_location_in_a_seed_list(seeds));
// // console.log(get_min_location_in_seed_ranges(seedRanges));
// console.log(get_min_location_falling_into_seed_ranges(seedRanges));

module.exports = {parse, get_min_location_in_a_seed_list, get_min_location_in_seed_ranges, get_min_location_falling_into_seed_ranges};