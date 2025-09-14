
//globals
let pokemonCache = {};              //cache, of the form: {name: pokemon(json)}
let pokemon_names = [];             //list of pokemon names from arguments
let stats = [];                     //list of stat names from arguments

const INVALID_ARGS =    "invalid arguments. command should be of the form: \ncompare -- [pikachu] [skarmony] -- stat [speed]\nexiting with code 1.";
const BAD_API =         "something went wrong with API call in compare.js - exiting with code 2.\n";

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
            switch(args[i+1].toUpperCase()){                        
                case 'COMPARE':                                             //should never reach. unless --comapre a b --stat c --comapre d (would add third pokemon to the list)
                    flag = 0;
                    i++;                                                    //skip and index (we already checked i + 1)
                break;
                
                case 'STAT':                                                //main thing to look for.
                    flag = 1;
                    i++;                                                    //skip and index (we already checked i + 1)
                break;
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
            }
        }   
    }
}

async function fetch_pokemon(){                                             // gotta cache them all
    for(let i = 0; i < pokemon_names.length; i++){      
        const name = pokemon_names[i];
        if(!pokemonCache[name]){                                            // avoids duplicates
            let current_pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`);
            if(!current_pokemon.ok){                                        // handles bad api request
                console.error(BAD_API);
                process.exit(2);
            }
            current_pokemon = await current_pokemon.json();
            pokemonCache[name] = current_pokemon;
        }
    }
}

function compare_stats(){                                                   // compares stats (stats) of pokemon (pokemonCache)

    for(let i = 0; i < stats.length; i++){                                  // main loop. loops over all entered stats to be comapred.

        let names_and_values = [];                                          // aray with important information of the form : [name, stat_value]. might be worth changing this to obj
        let current_stat_num = allowed_stats[stats[i].toUpperCase()];       // saves current stat of interest in a local variable

        for(const name in pokemonCache){                                    // loops through pokemonCache to init names_and_values
            let stat = pokemonCache[name].stats[current_stat_num].base_stat;
            names_and_values.push({                                         // adds {name, stat_value} tp names_and_values
                name, 
                stat
            });
        }

        
        let max = names_and_values[0];                                      // assign max to first index as default
        for(let j = 1; j < names_and_values.length; j++){                   //loop through names_and_values
            if(names_and_values[j].stat > max.stat){                        //max logic
                max = names_and_values[j];
            }
        }
        console.log(`pokemon with the highest ${stats[i]}: ${max.name}, ${max.stat}`);
        console.table(names_and_values);                                    //basic table
        
    }
}
async function compare(args){
    handle_args(args);                                      //parses arguments and saves them (global)
    await fetch_pokemon();                                  //fetches pokemon and stores them in pokemonCache.
    compare_stats();                                        //all info is stored globally in pokemonCache / globals
}

//exports it so the module may be recieved by main
module.exports = compare;