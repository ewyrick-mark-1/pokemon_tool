// tests/processTypes.test.js
const compare = require('../src/compare.js');  // adjust path if needed

describe('compare', function(){
    //valid tests
    test('two pokemon, one stat', async function(){
        let input = {
            function: 'COMPARE',
            arguments: { pokemon_names: [ 'pikachu', 'charizard' ], stats: [ 'atk' ] },
            flags: { json_flag: false, no_cache: false }
        };

        let expected_output = {
            ATK: {
                winner: { charizard: 84 },
                contestants: { pikachu: 55, charizard: 84 }
            }
        }
        

        let output = await compare(input);

        expect(output).toEqual(expected_output);

    });
    test('two pokemon, multiple stats', async function(){
        let input = {
            function: 'COMPARE',
            arguments: { pokemon_names: [ 'skarmory', 'charizard' ], stats: [ 'atk', 'def', 'spd' ] },
            flags: { json_flag: false, no_cache: false }
        };

        let expected_output = {
            ATK: {
                winner: { charizard: 84 },
                contestants: { skarmory: 80, charizard: 84 }
            },
            DEF: {
                winner: { skarmory: 140 },
                contestants: { skarmory: 140, charizard: 78 }
            },
            SPD: {
                winner: { charizard: 85 },
                contestants: { skarmory: 70, charizard: 85 }
            }
        }
        

        let output = await compare(input);

        expect(output).toEqual(expected_output);

    });
    
    //invalid tests

    //need to refactor code to throw errors & implement try / catch to make these tests
    
});