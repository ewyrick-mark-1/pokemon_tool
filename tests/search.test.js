// tests/processTypes.test.js
const search = require('../src/search.js');  // adjust path if needed

describe('search', function(){
    //valid tests
    test('single argument', async function(){
        let input = {
            main_command: 'SEARCH',
            arguments: { SEARCH: [ 'pikachu' ] },
            global_flags: { "JSON": false, "NO-CACHE": false }
        };

        let expected_output = {
            pikachu: {
                'id': 25,
                'name': 'pikachu',
                'type(s)': 'electric',
                'height (m)': '0.400',
                'weight (kg)': '6.000',
                'base hp': 35,
                'base atk': 55,
                'base def': 40,
                'base SpA': 50,
                'base SpD': 50,
                'base Spe': 90
            }
        }

        let output = await search(input);

        expect(output).toEqual(expected_output);

    });
    test('multiple arguments', async function(){
        let input = {
            main_command: 'SEARCH',
            arguments: { SEARCH: [ 'pikachu', 'charizard' ] },
            global_flags: { "JSON": false, "NO-CACHE": false }
        };

        let expected_output = {
            pikachu: {
                'id': 25,
                'name': 'pikachu',
                'type(s)': 'electric',
                'height (m)': '0.400',
                'weight (kg)': '6.000',
                'base hp': 35,
                'base atk': 55,
                'base def': 40,
                'base SpA': 50,
                'base SpD': 50,
                'base Spe': 90
            },
            charizard: {
                id: 6,
                name: 'charizard',
                'type(s)': 'fire, flying',
                'height (m)': '1.700',
                'weight (kg)': '90.500',
                'base hp': 78,
                'base atk': 84,
                'base def': 78,
                'base SpA': 109,
                'base SpD': 85,
                'base Spe': 100
            }
        }

        let output = await search(input);

        expect(output).toEqual(expected_output);

    });
    test('poke_id argument', async function(){
        let input = {
            main_command: 'SEARCH',
            arguments: { SEARCH: [ '123' ] },
            global_flags: { "JSON": false, "NO-CACHE": false }
        };

        let expected_output = {
            '123': {
                id: 123,
                name: 'scyther',
                'type(s)': 'bug, flying',
                'height (m)': '1.500',
                'weight (kg)': '56.000',
                'base hp': 70,
                'base atk': 110,
                'base def': 80,
                'base SpA': 55,
                'base SpD': 80,
                'base Spe': 105
            }
        }

        let output = await search(input);

        expect(output).toEqual(expected_output);

    });
    test('multiple mixed arguments', async function(){
        let input = {
            main_command: 'SEARCH',
            arguments: { SEARCH: [ 'pikachu', '123' ] },
            global_flags: { "JSON": false, "NO-CACHE": false }
        };

        let expected_output = {
            pikachu: {
                'id': 25,
                'name': 'pikachu',
                'type(s)': 'electric',
                'height (m)': '0.400',
                'weight (kg)': '6.000',
                'base hp': 35,
                'base atk': 55,
                'base def': 40,
                'base SpA': 50,
                'base SpD': 50,
                'base Spe': 90
            },
            '123': {
                id: 123,
                name: 'scyther',
                'type(s)': 'bug, flying',
                'height (m)': '1.500',
                'weight (kg)': '56.000',
                'base hp': 70,
                'base atk': 110,
                'base def': 80,
                'base SpA': 55,
                'base SpD': 80,
                'base Spe': 105
            }
        }

        let output = await search(input);

        expect(output).toEqual(expected_output);

    });
    //invalid tests

    test('no pokemon provided', async function(){
      let input = {
          main_command: 'SEARCH',
          arguments: { SEARCH: []}, 
          global_flags: { "JSON": false, "NO-CACHE": false }
      };

      await expect(search(input)).rejects.toThrow('Too few pokemon provided. You must specify at least 1. Exiting with code 1.');
    });
});