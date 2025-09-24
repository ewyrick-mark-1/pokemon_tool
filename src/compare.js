//imported functions
const fetchWithDelay = require('./fetchWithDelay.js');
//globals
const concurrent_limit = 5;



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


function checkStats(stats){
    for(let i = 0; i < stats.length; i++){
        if(!(stats[i].toUpperCase() in allowed_stats)){
            const error = new Error(`Invalid stat: ${stats[i]}. Exiting with code 1.`);
            error.errorCode = 1;
            throw error;
        }
    }
}

function checkInputs(inputs){
    if(inputs.arguments.STAT.length === 0){      //no inputs
        const error = new Error(`Too few stats provided. You must specify at least 1. Exiting with code 1.`);
        error.errorCode = 1;
        throw error;
    } 
    
    if(inputs.arguments.COMPARE.length < 2){
        const error = new Error(`Too few pokemon provided. You must specify at least 2. Exiting with code 1.`);
        error.errorCode = 1;
        throw error;
    } 

    checkStats(inputs.arguments.STAT);//check stats

    return true;
}


async function fetch_pokemon(pokemon_names){                                // gotta cache them all
    let pokemonCache = {};                                                  //cache, of the form: {name: pokemon(json)}
    const promises = pokemon_names.map( async (name) => {                   //uses map to apply the api fetch to all elements, then saves it to promises so it can all be sent out at once.
        if(!pokemonCache[name]){                                            //check local cache
            
            try{
                let current_pokemon = await fetchWithDelay(`https://pokeapi.co/api/v2/pokemon/${name}/`, 500, 5);
                current_pokemon = await current_pokemon.json();
                pokemonCache[name] = current_pokemon;
            }catch(err){
                console.error(err.message);
                process.exit(err.errorCode);
            }
            
            
        }
    });
    
    for(let i = 0; i < promises.length; i += concurrent_limit){             //concurrent limit, limits how hard the API it hit.
        
        if(i + concurrent_limit > promises.length){                         //prevent out of bounds index
            upper = promises.length;
        }else{                                                              //assign upper chunk bound to lower bound + offset
            upper = i + concurrent_limit
        }
        promises_lim = promises.slice(i, upper);                            //chunk promises
        await Promise.all(promises_lim);                                    //await 
    }
    
    return pokemonCache;
}

function compare_stats(pokemonCache, stats, json_flag, no_cache){                                                   // compares stats (stats) of pokemon (pokemonCache)
    let output = {};
    for(let i = 0; i < stats.length; i++){                                  // main loop. loops over all entered stats to be compared.

        let names_and_values = {};                                          // array with important information of the form : [name, stat_value]. might be worth changing this to obj
        let current_stat_name = stats[i].toUpperCase();
        let current_stat_num = allowed_stats[current_stat_name];            // saves current stat of interest in a local variable
        
        
        for(const name in pokemonCache){                                    // loops through pokemonCache to init names_and_values
            let stat = pokemonCache[name].stats[current_stat_num].base_stat;
            names_and_values[name] = stat;                                  // adds {name, stat_value} tp names_and_values

        }

        let top = {name: null, stat: -1}                                    // define structure. I am pretty sure -1 will not cause any errors
        for(const name in names_and_values){                                // iterates through names_and_values by key (name)
            if(names_and_values[name] > top.stat){                          // determines winner based on stat - no support for multiple winners atm
                top = { name: name, stat: names_and_values[name] };         // saves winner in top
            }
        }

        let winner_and_contestants = {};
        winner_and_contestants['winner'] = {[top.name] : top.stat};         // saves output in obj
        winner_and_contestants['contestants'] = names_and_values;

        
        output[current_stat_name] = winner_and_contestants;
        
    }
    if(json_flag){
        output = JSON.stringify(output);
    }
    return output;
}
async function compare(args){   
    checkInputs(args)                                                               //check that the args are valid

    const pokemon_names = args.arguments.COMPARE;                                   //assign inputs for better readability
    const stats = args.arguments.STAT;

    const json_flag = args.global_flags["JSON"];
    const no_cache = args.global_flags["NO-CACHE"];

    let pokemonCache = {};                                                          //cache, of the form: {name: pokemon(json)}


    pokemonCache = await fetch_pokemon(pokemon_names);                              //fetches pokemon and stores them in pokemonCache.
    const output = compare_stats(pokemonCache, stats, json_flag, no_cache);         //pokemon are stored in pokemonCache, so only pass the stats and flags

    return output;
    
    
}

//exports it so the module may be received by main
module.exports = compare;