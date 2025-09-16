//imported fucntions
const fetchWithDelay = require('./fetchWithDelay.js');




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





async function fetch_pokemon(pokemon_names){                                // gotta cache them all
    let pokemonCache = {};                                                  //cache, of the form: {name: pokemon(json)}
    const promises = pokemon_names.map( async (name) => {
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
    await Promise.all(promises);
    return pokemonCache;
}

function compare_stats(pokemonCache, stats, json_flag, no_cache){                                                   // compares stats (stats) of pokemon (pokemonCache)
    let output = {};
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
    const pokemon_names = args.arguments.pokemon_names;                     //assign inputs for better readability
    const stats = args.arguments.stats;
    const json_flag = args.flags.json_flag;
    const no_cache = args.flags.no_cache;

    let pokemonCache = {};                                                  //cache, of the form: {name: pokemon(json)}

    
    pokemonCache = await fetch_pokemon(pokemon_names);                      //fetches pokemon and stores them in pokemonCache.
    const output = compare_stats(pokemonCache, stats, json_flag, no_cache); //pokemon are stored in pokemonCache, so only pass the stats and flags

    return output;
}

//exports it so the module may be recieved by main
module.exports = compare;