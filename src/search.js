let pokemonCache = {};
let json_output = [];
let pokemon_names = [];
let json_flag  = false;
let no_cache = false;

const BAD_API = "ERROR: something went wrong with API call in search.js. \n\nexiting with code 2.\n";
const INVALID_ARGS = "ERROR: invalid arguments. command should be of the form: npm run start -- search [dugtrio]\n\nexiting with code 1.\n"
const NO_ARGS = "ERROR: No arguments provided. \n\nexiting with code 1.\n"
function handle_args(args){

    let flag = 0;

    for(let i = 0; i < args.length; i++){
        const current_input = args[i];
        if(current_input === '--'){                                         //looks for --, if seen checks the following command to update flag
            if(args[i+1]){                                                  //prevent out of bounds indexing
                switch(args[i+1].toUpperCase()){                                    
                    case 'SEARCH':                                          //looks for option search
                        flag = 0;
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
        }else{
            switch(flag){
                case 0 :                                            // types input
                    pokemon_names.push(current_input);              // adds all inputs
                break;
                case -1 :                                           // JSON output selected
                    if(current_input){                              // should not be any arguments. just a flag
                        console.error(INVALID_ARGS);
                        process.exit(1);
                    }
                break;
                case -2 :                                           // no-cache selected
                    if(current_input){                              // should not be any arguments. just a flag
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
    if(pokemon_names.length === 0){                                 //no pokemon inputs
        console.error(NO_ARGS);
        process.exit(1);
    }

}

function processTypes(types){                   //function to loop through types & return them as a single array (in the event that a pokemon has multiple types)
    let typelist = new Array;
    for(let i = 0; i < types.length; i++){
        typelist.push(types[i].type.name);
    }
    return typelist;
}

//function to fetchPokemon, outputs basic profile
async function fetchPokemon(){
    for(let i = 0; i < pokemon_names.length; i++){
        const name = pokemon_names[i];
        console.log("searching for :", name);
        let pokemon = {};
        if(!pokemonCache[name]){
            pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`);
            if(!pokemon.ok){//handles bad api request
                console.error(BAD_API);
                process.exit(2);
            }
            pokemon = await pokemon.json();
            pokemonCache[name] = pokemon
        }

        //build obj of needed values
        let stats = {
            "id"            : pokemon.id,
            "name"          : pokemon.name,
            "types"         : processTypes(pokemon.types).join(", "),
            "height (m)"    : (pokemon.height * 0.1).toFixed(3),        //adjusts to standard measurments & limits precision
            "weight (kg)"   : (pokemon.weight * 0.1).toFixed(3),
            "base hp"       : pokemon.stats[0].base_stat,               // 0 is base hp
            "base atk"      : pokemon.stats[1].base_stat,
            "base def"      : pokemon.stats[2].base_stat,
            "base SpA"      : pokemon.stats[3].base_stat,
            "base SpD"      : pokemon.stats[4].base_stat,
            "base Spe"      : pokemon.stats[5].base_stat,
        }
        if(json_flag){                                                  // different behavior if --json
            json_output.push({[name] : stats});                         // compile all requested into one list
        }else {
            console.table(stats);                                       // default output, print in table format
        }
        
        
        
    }

    if(json_flag){                                      //string all queried pokemon if --json
        const out = JSON.stringify(json_output);
        console.log(out);                               //output it to terminal, might be worth making it a file output vis fs
    }
    
 
    
}

function search(args){
    handle_args(args);      //parses arguments and handles argument errors
    fetchPokemon();         //calls API and either comiles outputs to custom json or output as table.
    
    
}

//exports it so the module may be recieved by main
module.exports = search;