// tests/processTypes.test.js
const compare = require('../src/compare.js');  // adjust path if needed

describe('compare', function(){
    //valid tests
    test('two pokemon, one stat', async function(){
        let input = {
            main_command: 'COMPARE',
            arguments: { COMPARE: [ 'pikachu', 'charizard' ], STAT: [ 'atk' ] },
            global_flags: { "JSON": false, "NO-CACHE": false }
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
            main_command: 'COMPARE',
            arguments: { COMPARE: [ 'skarmory', 'charizard' ], STAT: [ 'atk', 'def', 'spd' ] },
            global_flags: { "JSON": false, "NO-CACHE": false }
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
    test('no pokemon provided', async function(){
      let input = {
          main_command: 'COMPARE',
          arguments: { COMPARE: [], STAT: ['atk'] }, 
          global_flags: { "JSON": false, "NO-CACHE": false }
      };

      await expect(compare(input)).rejects.toThrow('Too few pokemon provided. You must specify at least 2. Exiting with code 1.');
    });
    test('no stats provided', async function(){
      let input = {
          main_command: 'COMPARE',
          arguments: { COMPARE: ['pikachu', 'charizard'], STAT: [] }, 
          global_flags: { "JSON": false, "NO-CACHE": false }
      };

      await expect(compare(input)).rejects.toThrow('Too few stats provided. You must specify at least 1. Exiting with code 1.');
    });
    test('only one pokemon provided', async function(){
      let input = {
          main_command: 'COMPARE',
          arguments: { COMPARE: ['pikachu'], STAT: ['atk'] },  // Only 1 pokemon
          global_flags: { "JSON": false, "NO-CACHE": false }
      };

      await expect(compare(input)).rejects.toThrow('Too few pokemon provided. You must specify at least 2. Exiting with code 1.');
    });
    test('invalid stat provided', async function(){
      let input = {
          main_command: 'COMPARE',
          arguments: { COMPARE: ['pikachu', 'charizard'], STAT: ['invalid'] },
          global_flags: { "JSON": false, "NO-CACHE": false }
      };

      await expect(compare(input)).rejects.toThrow('Invalid stat: invalid. Exiting with code 1.');
     });
    
});