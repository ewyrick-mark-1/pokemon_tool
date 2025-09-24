// tests/processTypes.test.js
const list = require('../src/list.js');  // adjust path if needed

describe('list', function(){
    //valid tests
    test('single argument', async function(){
        let input = {
            main_command: 'LIST',
            arguments: { TYPE: [ 'electric' ], PAGE: 0, PAGESIZE: 10 },
            global_flags: { "JSON": false, "NO-CACHE": false }
        };

        let expected_output = [
            { type: 'electric', id: '25', name: 'pikachu' },
            { type: 'electric', id: '26', name: 'raichu' },
            { type: 'electric', id: '81', name: 'magnemite' },
            { type: 'electric', id: '82', name: 'magneton' },
            { type: 'electric', id: '100', name: 'voltorb' },
            { type: 'electric', id: '101', name: 'electrode' },
            { type: 'electric', id: '125', name: 'electabuzz' },
            { type: 'electric', id: '135', name: 'jolteon' },
            { type: 'electric', id: '145', name: 'zapdos' },
            { type: 'electric', id: '170', name: 'chinchou' }
        ]
        

        let output = await list(input);

        expect(output).toEqual(expected_output);

    });
    test('multiple arguments', async function(){
        let input = {
            main_command: 'LIST',
            arguments: { TYPE: [ 'electric', 'steel' ], PAGE: 0, PAGESIZE: 10 },
            global_flags: { "JSON": false, "NO-CACHE": false }
        };

        let expected_output = [
            { type: 'electric', id: '25', name: 'pikachu' },
            { type: 'electric', id: '26', name: 'raichu' },
            { type: 'electric', id: '81', name: 'magnemite' },
            { type: 'electric', id: '82', name: 'magneton' },
            { type: 'electric', id: '100', name: 'voltorb' },
            { type: 'electric', id: '101', name: 'electrode' },
            { type: 'electric', id: '125', name: 'electabuzz' },
            { type: 'electric', id: '135', name: 'jolteon' },
            { type: 'electric', id: '145', name: 'zapdos' },
            { type: 'electric', id: '170', name: 'chinchou' },
            { type: 'steel', id: '81', name: 'magnemite' },
            { type: 'steel', id: '82', name: 'magneton' },
            { type: 'steel', id: '205', name: 'forretress' },
            { type: 'steel', id: '208', name: 'steelix' },
            { type: 'steel', id: '212', name: 'scizor' },
            { type: 'steel', id: '227', name: 'skarmory' },
            { type: 'steel', id: '303', name: 'mawile' },
            { type: 'steel', id: '304', name: 'aron' },
            { type: 'steel', id: '305', name: 'lairon' },
            { type: 'steel', id: '306', name: 'aggron' }
        ]
        

        let output = await list(input);

        expect(output).toEqual(expected_output);

    });
    test('single argument with page ', async function(){
        let input = {
            main_command: 'LIST',
            arguments: { TYPE: [ 'electric' ], PAGE: 3, PAGESIZE: 10 },
            global_flags: { "JSON": false, "NO-CACHE": false }
        };

        let expected_output = [
            { type: 'electric', id: '587', name: 'emolga' },
            { type: 'electric', id: '595', name: 'joltik' },
            { type: 'electric', id: '596', name: 'galvantula' },
            { type: 'electric', id: '602', name: 'tynamo' },
            { type: 'electric', id: '603', name: 'eelektrik' },
            { type: 'electric', id: '604', name: 'eelektross' },
            { type: 'electric', id: '618', name: 'stunfisk' },
            { type: 'electric', id: '642', name: 'thundurus-incarnate' },
            { type: 'electric', id: '644', name: 'zekrom' },
            { type: 'electric', id: '694', name: 'helioptile' }
        ]
        

        let output = await list(input);

        expect(output).toEqual(expected_output);

    });
    test('single argument with page and pageSize', async function(){
        let input = {
            main_command: 'LIST',
            arguments: { TYPE: [ 'electric' ], PAGE: 3, PAGESIZE: 20 },
            global_flags: { "JSON": false, "NO-CACHE": false }
        };

        let expected_output = [
            { type: 'electric', id: '938', name: 'tadbulb' },
            { type: 'electric', id: '939', name: 'bellibolt' },
            { type: 'electric', id: '940', name: 'wattrel' },
            { type: 'electric', id: '941', name: 'kilowattrel' },
            { type: 'electric', id: '989', name: 'sandy-shocks' },
            { type: 'electric', id: '992', name: 'iron-hands' },
            { type: 'electric', id: '995', name: 'iron-thorns' },
            { type: 'electric', id: '1008', name: 'miraidon' },
            { type: 'electric', id: '1021', name: 'raging-bolt' },
            { type: 'electric', id: '10008', name: 'rotom-heat' },
            { type: 'electric', id: '10009', name: 'rotom-wash' },
            { type: 'electric', id: '10010', name: 'rotom-frost' },
            { type: 'electric', id: '10011', name: 'rotom-fan' },
            { type: 'electric', id: '10012', name: 'rotom-mow' },
            { type: 'electric', id: '10020', name: 'thundurus-therian' },
            { type: 'electric', id: '10045', name: 'ampharos-mega' },
            { type: 'electric', id: '10055', name: 'manectric-mega' },
            { type: 'electric', id: '10080', name: 'pikachu-rock-star' },
            { type: 'electric', id: '10081', name: 'pikachu-belle' },
            { type: 'electric', id: '10082', name: 'pikachu-pop-star' }
        ]
        

        let output = await list(input);

        expect(output).toEqual(expected_output);

    });
    test('single argument with --json', async function(){
        let input = {
            main_command: 'LIST',
            arguments: { TYPE: [ 'electric' ], PAGE: 0, PAGESIZE: 10 },
            global_flags: { "JSON": true, "NO-CACHE": false }
        };
        //JSON string output (I think)
        let expected_output = "{\"electric\":{\"25\":\"pikachu\",\"26\":\"raichu\",\"81\":\"magnemite\",\"82\":\"magneton\",\"100\":\"voltorb\",\"101\":\"electrode\",\"125\":\"electabuzz\",\"135\":\"jolteon\",\"145\":\"zapdos\",\"170\":\"chinchou\"}}"
        

        let output = await list(input);

        expect(output).toEqual(expected_output);

    });
    //invalid tests

    test('no pokemon provided', async function(){
      let input = {
          main_command: 'LIST',
          arguments: { TYPE: [], PAGE: 0, PAGESIZE: 10}, 
          global_flags: { "JSON": false, "NO-CACHE": false }
      };

      await expect(list(input)).rejects.toThrow('Too few types provided. You must specify at least 1. Exiting with code 1.');
    });
    
});