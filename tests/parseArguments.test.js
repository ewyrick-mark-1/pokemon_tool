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

    //invalid tests - checks that error throwing is working in most cases.

    test('invalid bascommand', function(){
        let input = [ 'invalid' ];

        let expected_error = new Error(`Unknown Command: invalid. If you need help, enter npm run start -- help. Exiting with code 1.`);
        //does not test for error code.

        expect(() => parseArguments(input)).toThrow(expected_error);

    });

    //search
    test('invalid basic search', function(){
        let input = [ 'search', '--invalid' ];

        let expected_error = new Error(`Unknown Command: -- invalid. Exiting with code 1.`);
        //does not test for error code.

        expect(() => parseArguments(input)).toThrow(expected_error);

    });
    test('invalid trailing search', function(){
        let input = [ 'search', '--' ];

        let expected_error = new Error(`Trailing --. Exiting with code 1.`);
        //does not test for error code.

        expect(() => parseArguments(input)).toThrow(expected_error);

    });
    test('invalid json search', function(){
        let input = [ 'search', 'pikachu', '--json', 'pikachu' ];

        let expected_error = new Error(`Unknown Command: --json pikachu. Exiting with code 1.`);
        //does not test for error code.

        expect(() => parseArguments(input)).toThrow(expected_error);

    });
    test('invalid no-cache search', function(){
        let input = [ 'search', 'pikachu', '--no-cache', 'pikachu' ];

        let expected_error = new Error(`Unknown Command: --no-cache pikachu. Exiting with code 1.`);
        //does not test for error code.

        expect(() => parseArguments(input)).toThrow(expected_error);

    });
    test('invalid empty search', function(){
        let input = [ 'search' ];

        let expected_error = new Error('No arguments provided. Exiting with code 1.');
        //does not test for error code.

        expect(() => parseArguments(input)).toThrow(expected_error);

    });

    //list
    test('invalid basic list', function(){
        let input = [ 'list', '--invalid' ];

        let expected_error = new Error(`Unknown Command: -- invalid. Exiting with code 1.`);
        //does not test for error code.

        expect(() => parseArguments(input)).toThrow(expected_error);

    });
    test('invalid trailing list', function(){
        let input = [ 'list', '--' ];

        let expected_error = new Error(`Trailing --. Exiting with code 1.`);
        //does not test for error code.

        expect(() => parseArguments(input)).toThrow(expected_error);

    });
    test('invalid page argument list', function(){
        let input = [ 'list', '--type', 'electric', '--page', 'invalid' ];

        let expected_error = new Error(`Invalid Argument: invalid. Exiting with code 1.`);
        //does not test for error code.

        expect(() => parseArguments(input)).toThrow(expected_error);

    });
    test('invalid pageSize argument list', function(){
        let input = [ 'list', '--type', 'electric', '--pageSize', 'invalid' ];

        let expected_error = new Error(`Invalid Argument: invalid. Exiting with code 1.`);
        //does not test for error code.

        expect(() => parseArguments(input)).toThrow(expected_error);

    });
    test('invalid number of page arguments list', function(){
        let input = [ 'list', '--type', 'electric', '--page', '1', '5' ];

        let expected_error = new Error(`Invalid Argument: 5. Exiting with code 1.`);
        //does not test for error code.

        expect(() => parseArguments(input)).toThrow(expected_error);

    });
    test('invalid number of pageSize arguments list', function(){
        let input = [ 'list', '--type', 'electric', '--pageSize', '20', '10' ];

        let expected_error = new Error(`Invalid Argument: 10. Exiting with code 1.`);
        //does not test for error code.

        expect(() => parseArguments(input)).toThrow(expected_error);

    });
    test('invalid json list', function(){
        let input = [ 'list', 'pikachu', '--json', 'pikachu' ];

        let expected_error = new Error(`Unknown Command: --json pikachu. Exiting with code 1.`);
        //does not test for error code.

        expect(() => parseArguments(input)).toThrow(expected_error);

    });
    test('invalid no-cache list', function(){
        let input = [ 'list', 'pikachu', '--no-cache', 'pikachu' ];

        let expected_error = new Error(`Unknown Command: --no-cache pikachu. Exiting with code 1.`);
        //does not test for error code.

        expect(() => parseArguments(input)).toThrow(expected_error);

    });
    test('invalid empty list', function(){
        let input = [ 'list', '--page', '2' ];

        let expected_error = new Error(`Invalid Number of Arguments. Exiting with code 1.`);
        //does not test for error code.

        expect(() => parseArguments(input)).toThrow(expected_error);

    });

    //compare
    test('invalid basic compare', function(){
        let input = [ 'compare', '--invalid' ];

        let expected_error = new Error(`Unknown Command: -- invalid. Exiting with code 1.`);
        //does not test for error code.

        expect(() => parseArguments(input)).toThrow(expected_error);

    });
    test('invalid trailing compare', function(){
        let input = [ 'compare', '--' ];

        let expected_error = new Error(`Trailing --. Exiting with code 1.`);
        //does not test for error code.

        expect(() => parseArguments(input)).toThrow(expected_error);

    });
    test('invalid stat compare', function(){
        let input = [ 'compare', 'pikachu', 'skarmory', '--stat', 'invalid' ];

        let expected_error = new Error(`Invalid stat: invalid. Exiting with code 1.`);
        //does not test for error code.

        expect(() => parseArguments(input)).toThrow(expected_error);

    });
    test('invalid json compare', function(){
        let input = [ 'compare', 'pikachu', 'charizard', '--stat', 'def', '--json', 'pikachu' ];

        let expected_error = new Error(`Unknown Command: --json pikachu. Exiting with code 1.`);
        //does not test for error code.

        expect(() => parseArguments(input)).toThrow(expected_error);

    });
    test('invalid no-cache compare', function(){
        let input = [ 'compare', 'pikachu', 'charizard', '--stat', 'def', '--no-cache', 'pikachu' ];

        let expected_error = new Error(`Unknown Command: --no-cache pikachu. Exiting with code 1.`);
        //does not test for error code.

        expect(() => parseArguments(input)).toThrow(expected_error);

    });
    test('invalid empty pokemon compare', function(){
        let input = [ 'compare', 'pikachu', '--stat', 'def' ];

        let expected_error = new Error(`Too few pokemon. Exiting with code 1.`);
        //does not test for error code.

        expect(() => parseArguments(input)).toThrow(expected_error);

    });
    test('invalid empty stats compare', function(){
        let input = [ 'compare', 'pikachu', 'charizard', '--stat' ];

        let expected_error = new Error(`No stats provided to compare. Exiting with code 1.`);
        //does not test for error code.

        expect(() => parseArguments(input)).toThrow(expected_error);

    });
    
});