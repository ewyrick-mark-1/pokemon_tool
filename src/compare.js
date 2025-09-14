
//globals
let cache = {};                     //cache
let pokemon_names = [];             //list of pokemon names from arguments
let stats = [];                     //list of stat names from arguments


const INVALID_ARGS = "invalid arguments. command should be of the form: \ncompare -- [pikachu] [skarmony] -- stat [speed]\nexiting with code 1.";
const allowed_stats = {             //list of allowed stats
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


function isStat(stat){
    return  stat.toUpperCase() in allowed_stats;      // checks entered key against allowed ones
}

function handle_args(args){

    let flag = 0;                                                   //flag keeps track of what arg we are looking at (pokemon_names : 0, stat : 1)


    //main argument loop
    for(let i = 0; i < args.length; i++){
        const current_input = args[i];
        
        
        if(current_input === '--'){                                 //looks for --, if seen checks the following command to update flag
            switch(args[i+1].toUpperCase()){                        
                case 'COMPARE':                                     //should never reach. unless --comapre a b --stat c --comapre d (would add third pokemon to the list)
                    flag = 0;
                    i++;                                            //skip and index (we already checked i + 1)
                break;
                
                case 'STAT':                                        //main thing to look for.
                    flag = 1;
                    i++;                                            //skip and index (we already checked i + 1)
                break;
            }                               
        } else{
            switch(flag){                                           
                case 0 :                                            // pokemon input
                    pokemon_names.push(current_input);                    // adds all pokemon inputs, more robust
                break;
                case 1 :                                            // stat input
                        if(isStat(current_input)){                  // makes sure the input is a valid stat
                            stats.push(current_input);              // assigns input to stat
                        } else {
                            console.error(INVALID_ARGS);
                            process.exit(1);                        // basic error handling
                        }
                break;
            }
        }   
    }
}

async function fetch_pokemon(){         // caches pokemon
    let pokemon = [];                   //actual, full pulled json pokemon data
    for(let i = 0; i < pokemon_names.length; i++){
        const name = pokemon_names[i];
        if(cache[name]){
            pokemon.push(cache[name]);
        } else {
            let current_pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`);
            current_pokemon = await current_pokemon.json();
            pokemon.push(current_pokemon);
        }
    }
    return pokemon;
    //console.log(pokemon, stats);
}

function compare_stats(pokemon){
    
    

    for(let i = 0; i < stats.length; i++){

        let names_and_values = [];
        let current_stat_num = allowed_stats[stats[i].toUpperCase()];

        for(let j = 0; j < pokemon.length; j++){
            names_and_values.push([pokemon[j].name, pokemon[j].stats[current_stat_num].base_stat]);
            
        }

        
        let max = names_and_values[0];
        for(let j = 1; j < names_and_values.length; j++){
            if(names_and_values[j][1] > max[1]){
                max = names_and_values[j]
            }
        }
        console.log(`pokemon with the highest ${stats[i]}: ${max}`);
        console.table(names_and_values);
        
    }
}
async function compare(args){
    handle_args(args);                  //parses arguments and saves them (global)
    console.log(pokemon_names, stats);
    let pokemon = await fetch_pokemon();                    //fetches pokemon and stores them in pokemon
    
    compare_stats(pokemon);                    //stats are saved gloablly
}

//exports it so the module may be recieved by main
module.exports = compare;