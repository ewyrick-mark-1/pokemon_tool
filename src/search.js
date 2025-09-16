//imported fucntions
const fetchWithDelay = require('./fetchWithDelay.js');  //fetchWithDelay(url, wait, attempts)


function processTypes(types){                   //function to loop through types & return them as a single array (in the event that a pokemon has multiple types)
    let typelist = new Array;
    for(let i = 0; i < types.length; i++){
        typelist.push(types[i].type.name);
    }
    return typelist;
}


async function fetchPokemon(pokemon_names){     //performs API call for all pokemon that were input. does not batch, and moves linearlly (bad). if time, update & add concurrency limit
    let pokemonCache = {};
    
        const promises = pokemon_names.map( async (name) => {
            console.log("searching for :", name);
    
            if(!pokemonCache[name]){                //if cached dont bother
                try{
                    let pokemon = await fetchWithDelay(`https://pokeapi.co/api/v2/pokemon/${name}/`, 500, 5);
                    pokemon = await pokemon.json();
                    pokemonCache[name] = pokemon
                }catch(err){
                    console.error(err.message);
                    process.exit(err.errorCode);
                }
                
                
            }
        });

        await Promise.all(promises);
    
    return pokemonCache;
}

async function pokemonStats(pokemonCache,  json_flag, no_cache){

    let output = {}                                                     //define output

    for(pokemon_name in pokemonCache){                                  //itterates through cache
        pokemon = pokemonCache[pokemon_name];                           //assign current pokemon
        let stats = {                                                   //assign all stats to defined output elements structure
            "id"            : pokemon.id,
            "name"          : pokemon.name,
            "type(s)"       : processTypes(pokemon.types).join(", "),
            "height (m)"    : (pokemon.height * 0.1).toFixed(3),        //adjusts to standard measurments & limits precision
            "weight (kg)"   : (pokemon.weight * 0.1).toFixed(3),
            "base hp"       : pokemon.stats[0].base_stat,               // 0 is base hp
            "base atk"      : pokemon.stats[1].base_stat,
            "base def"      : pokemon.stats[2].base_stat,
            "base SpA"      : pokemon.stats[3].base_stat,
            "base SpD"      : pokemon.stats[4].base_stat,
            "base Spe"      : pokemon.stats[5].base_stat,
        }
        output[pokemon_name] = stats;                                   //add new kvp to output obj
    }

    if(json_flag){                                                      //string all queried pokemon if --json
        output = JSON.stringify(output);
    }
    return output;
 
    
}

async function search(args){
    const pokemon_names = args.arguments.pokemon_names;                 //assign inputs to more readable variables
    const json_flag = args.flags.json_flag;
    const no_cache = args.flags.no_cache;
    let pokemonCache = {};

    pokemonCache = await fetchPokemon(pokemon_names);                                   //fetch all pokemon (one at a time)
    const output = pokemonStats(pokemonCache, json_flag, no_cache);                     //call stats once all have been fetched

    return output;
    
}

//exports it so the module may be recieved by main
module.exports = search;