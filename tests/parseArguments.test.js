// tests/processTypes.test.js
const parseArguments = require('../src/parseArguments.js');  // adjust path if needed

describe('parseArguments', function(){
    //valid tests, should cover most cases
    test('basic search parse', function(){
        let input = [ 'search', 'pikachu' ];

        let expected_output = {
            main_command: 'SEARCH',
            arguments: { SEARCH: [ 'pikachu' ] },
            global_flags: { "JSON": false, "NO-CACHE": false }
        };
        

        let output = parseArguments(input);

        expect(output).toEqual(expected_output);

    });
    test('complex list parse', function(){
        let input = [
            'list', '--',
            'type', 'electric',
            '--',   'page',
            '2',    '--pageSize',
            '15',   '--json'
        ];

        let expected_output = {
            main_command: 'LIST',
            arguments: { TYPE: [ 'electric' ], PAGE: 2, PAGESIZE: 15 },
            global_flags: { "JSON": true, "NO-CACHE": false }
        };
        

        let output = parseArguments(input);

        expect(output).toEqual(expected_output);

    });
    test('complex compare parse', function(){
        let input = [
            'compare',   'pikachu',
            'charizard', '--',
            'stat',      'atk',
            'def',       'spd'
        ];

        let expected_output = {
            main_command: 'COMPARE',
            arguments: {
                COMPARE: [ 'pikachu', 'charizard' ],
                STAT: [ 'atk', 'def', 'spd' ]
            },
            global_flags: { "JSON": false, "NO-CACHE": false }
        };
        

        let output = parseArguments(input);

        expect(output).toEqual(expected_output);

    });

    //invalid tests - checks that error throwing is working in most cases.

    //invalid general tests
    test('invalid basecommand', function(){
        let input = [ 'invalid' ];

        let expected_error = new Error(`Unknown Command: invalid. If you need help, enter npm run start -- help. Exiting with code 1.`);
        //does not test for error code.

        expect(() => parseArguments(input)).toThrow(expected_error);

    });
    test('invalid trailing', function(){
        let input = [ 'search', '--' ];

        let expected_error = new Error(`Trailing --. Exiting with code 1.`);
        //does not test for error code.

        expect(() => parseArguments(input)).toThrow(expected_error);

    });
    test('invalid json', function(){
        let input = [ 'search', 'pikachu', '--json', 'pikachu' ];

        let expected_error = new Error(`Unknown Command: -- json pikachu. Exiting with code 1.`);
        //does not test for error code.

        expect(() => parseArguments(input)).toThrow(expected_error);

    });
    test('invalid no-cache', function(){
        let input = [ 'search', 'pikachu', '--no-cache', 'pikachu' ];

        let expected_error = new Error(`Unknown Command: -- no-cache pikachu. Exiting with code 1.`);
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
    
    
    
    //list
    test('invalid basic list', function(){
        let input = [ 'list', '--invalid' ];

        let expected_error = new Error(`Unknown Command: -- invalid. Exiting with code 1.`);
        //does not test for error code.

        expect(() => parseArguments(input)).toThrow(expected_error);

    });
    test('invalid page argument list', function(){
        let input = [ 'list', '--type', 'electric', '--page', 'invalid' ];

        let expected_error = new Error(`Invalid Argument, wrong data type: invalid. Exiting with code 1.`);
        //does not test for error code.

        expect(() => parseArguments(input)).toThrow(expected_error);

    });
    test('invalid pageSize argument list', function(){
        let input = [ 'list', '--type', 'electric', '--pageSize', 'invalid' ];

        let expected_error = new Error(`Invalid Argument, wrong data type: invalid. Exiting with code 1.`);
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
    
    
});