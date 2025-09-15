//imported fucntions
const fetchWithDelay = require('./fetchWithDelay.js');

//globals
let pokemonCache = {};              //cache, of the form: {name: pokemon(json)}
let pokemon_names = [];             //list of pokemon names from arguments
let stats = [];                     //list of stat names from arguments
//special cases
let json_output = {};
let json_flag  = false;
let no_cache = false;

const INVALID_ARGS      = "invalid arguments. command should be of the form: \ncompare -- [pikachu] [skarmony] -- stat [speed]\n\nexiting with code 1.\n";
const NO_NAMES          = "ERROR: too few pokemon provided. \n\nexiting with code 1.\n"
const NO_STATS          = "ERROR: No stat provided as argument. \n\nexiting with code 1.\n"

const allowed_stats = {                                                     //list of allowed stats. key-value paired
    'HP'                : 0,
    'ATTACK'            : 1,
    'ATK'               : 1,
    'DEFENSE'           : 2,
    'DEF'               : 2,
    'SPECIAL-ATTACK'    : 3,
    'SPA'               : 3,
    'SPECIAL-DEFENSE'   : 4,
    'SPD'               : 4,
    'SPEED'             : 5,
    'SPE'               : 5
};


function isStat(stat){                                                      // checks if stat is in allowed_stats
    return  stat.toUpperCase() in allowed_stats;                            // checks entered key against allowed ones
}

function handle_args(args){                                                 // parses arguments and stores in pokemon_names and stats

    let flag = 0;                                                           //flag keeps track of what arg we are looking at (compare : 0, stat : 1)


    //main argument loop
    for(let i = 0; i < args.length; i++){
        const current_input = args[i];
        
        
        if(current_input === '--'){                                         //looks for --, if seen checks the following command to update flag
            if(args[i+1]){                                              //prevent out of bounds indexing
                switch(args[i+1].toUpperCase()){                        
                    case 'COMPARE':                                         //should never reach. unless --comapre a b --stat c --comapre d (would add third pokemon to the list)
                        flag = 0;
                        i++;                                                //skip and index (we already checked i + 1)
                    break;
                    
                    case 'STAT':                                            //main thing to look for.
                        flag = 1;
                        i++;                                                //skip and index (we already checked i + 1)
                    break;
                    case 'JSON':                                            //looks for option json
                        flag = -1;
                        json_flag = true;
                        i++;                                                //skip and index (we already checked i + 1)
                    break;
                    case 'NO-CACHE':                                        //looks for option no-cache
                        flag = -2;
                        no_cache = true;
                        i++;                                                //skip and index (we already checked i + 1)
                    break;
                    default:                                                //error catchall
                        console.error(INVALID_ARGS);
                        process.exit(1);
                    break;
                }                              
            }else{
                    console.error(INVALID_ARGS);
                    process.exit(1);
            } 
        } else{
            switch(flag){                                           
                case 0 :                                                    // pokemon input
                    pokemon_names.push(current_input);                      // adds all pokemon inputs, more robust
                break;
                case 1 :                                                    // stat input
                        if(isStat(current_input)){                          // makes sure the input is a valid stat
                            stats.push(current_input);                      // assigns input to stat. **does not check for duplicates**
                        } else {
                            console.error(INVALID_ARGS);
                            process.exit(1);                                // basic error handling
                        }
                break;
                case -1 :                                                           // JSON output selected
                    if(current_input){                                              // should not be any arguments. just a flag. unnecessary case- indluded for completness
                        console.error(INVALID_ARGS);
                        process.exit(1);
                    }
                break;
                case -2 :                                                           // no-cache selected
                    if(current_input){                                              // should not be any arguments. just a flag. unnecessary case- indluded for completness
                        console.error(INVALID_ARGS);
                        process.exit(1);
                    }
                break;
                default:
                    console.error(INVALID_ARGS);                    //error catchall
                    process.exit(1);
                break;
            }
        }   
    }
    if(pokemon_names.length <= 1){
        console.error(NO_NAMES);                                //no/too few arguments condition
        process.exit(1);
    }
    if(stats.length === 0){
        console.error(NO_STATS);                                //no arguments condition
        process.exit(1);
    }
}

async function fetch_pokemon(){                                             // gotta cache them all
    for(let i = 0; i < pokemon_names.length; i++){      
        const name = pokemon_names[i];
        if(!pokemonCache[name]){                                            // avoids duplicates
            let current_pokemon = await fetchWithDelay(`https://pokeapi.co/api/v2/pokemon/${name}/`, 500, 5);
            
            current_pokemon = await current_pokemon.json();
            pokemonCache[name] = current_pokemon;
        }
    }
}

function compare_stats(){                                                   // compares stats (stats) of pokemon (pokemonCache)

    for(let i = 0; i < stats.length; i++){                                  // main loop. loops over all entered stats to be comapred.

        let names_and_values = {};                                          // aray with important information of the form : [name, stat_value]. might be worth changing this to obj
        let current_stat_name = stats[i].toUpperCase();
        let current_stat_num = allowed_stats[current_stat_name];            // saves current stat of interest in a local variable
        
        
        for(const name in pokemonCache){                                    // loops through pokemonCache to init names_and_values
            let stat = pokemonCache[name].stats[current_stat_num].base_stat;
            names_and_values[name] = stat;                                  // adds {name, stat_value} tp names_and_values

        }

        let top = {name: null, stat: -1}                                    // define structure. I am pretty sure -1 will not cause any errors
        for(const name in names_and_values){                                // iterates through names_and_values by key (name)
            if(names_and_values[name] > top.stat){                          // determintes winner based on stat - no support for multiple winners atm
                top = { name: name, stat: names_and_values[name] };         // saves winner in top
            }
        }

        let winner_and_contestants = {};
        winner_and_contestants['winner'] = {[top.name] : top.stat};         // saves output in a logical way
        winner_and_contestants['contestants'] = names_and_values;

        if(json_flag){
            json_output[current_stat_name] = winner_and_contestants;
        }else{
            console.log(`pokemon with the highest ${stats[i]}: ${top.name}, with ${stats[i]} of ${top.stat}`);
            console.table(names_and_values);                                    //basic table
        }
    }
    if(json_flag){
        const out = JSON.stringify(json_output);
        console.log(out);
    }
}
async function compare(args){
    handle_args(args);                                      //parses arguments and saves them (global)
    await fetch_pokemon();                                  //fetches pokemon and stores them in pokemonCache.
    compare_stats();                                        //all info is stored globally in pokemonCache / globals
}

//exports it so the module may be recieved by main
module.exports = compare;