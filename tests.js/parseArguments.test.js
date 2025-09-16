// tests/processTypes.test.js
const parseArguments = require('../src/parseArguments.js');  // adjust path if needed

describe('parseArguments', function(){
    //valid tests, should cover most cases
    test('basic search call', function(){
        let input = [ 'search', 'pikachu' ];

        let expected_output = {
            function: 'SEARCH',
            arguments: { pokemon_names: [ 'pikachu' ] },
            flags: { json_flag: false, no_cache: false }
        };
        

        let output = parseArguments(input);

        expect(output).toEqual(expected_output);

    });
    test('complex list call', function(){
        let input = [
            'list', '--',
            'type', 'electric',
            '--',   'page',
            '2',    '--pageSize',
            '15',   '--json'
        ];

        let expected_output = {
            function: 'LIST',
            arguments: { types: [ 'electric' ], page: 1, pageSize: 15 },
            flags: { json_flag: true, no_cache: false }
        };
        

        let output = parseArguments(input);

        expect(output).toEqual(expected_output);

    });
    test('complex comapre call', function(){
        let input = [
            'compare',   'pikachu',
            'charizard', '--',
            'stat',      'atk',
            'def',       'spd'
        ];

        let expected_output = {
            function: 'COMPARE',
            arguments: {
                pokemon_names: [ 'pikachu', 'charizard' ],
                stats: [ 'atk', 'def', 'spd' ]
            },
            flags: { json_flag: false, no_cache: false }
        };
        

        let output = parseArguments(input);

        expect(output).toEqual(expected_output);

    });
    
    
    //invalid tests

    //need to refactor code to throw errors & implement try / catch to make these tests
    
});