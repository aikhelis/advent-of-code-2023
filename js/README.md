run tests, including checking for correctness of the answer to the puzzle input 
```
jest 
```
to run tests for a specific puzzle use a filter argument (regex), eg for day 1 puzzle
```
jest 01/
```
to increase heap size
```
export NODE_OPTIONS=--max-old-space-size=4096; jest 
//or
export NODE_OPTIONS=--max-old-space-size=4096; node *.js
```