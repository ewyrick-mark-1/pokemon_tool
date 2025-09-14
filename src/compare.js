
//globals
let cache = {};                     //cache
let pokemon_names = [];             //list of pokemon names from arguments
let stats = [];                     //list of stat names from arguments
let pokemon = [];                   //actual, full pulled json pokemon data

const INVALID_ARGS = "invalid arguments. command should be of the form: \ncompare -- [pikachu] [skarmony] -- stat [speed]\nexiting with code 1.";
const allowed_stats = [             //list of allowed stats
    'hp',
    'attack',
    'defense',
    'special-attack',
    'special-defense',
    'speed',
    'atk',
    'def',
    'spd',
    'spe'
];


function isStat(stat){
    for (let i = 0; i < allowed_stats.length; i++){
        if(stat.toUpperCase() === allowed_stats[i].toUpperCase()){  //puts both to uppercase to catch mixed capitalization
            return true;
        } 
    }

    return false;                                                   //default case
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

async function fetch_pokemon(){ // caches pokemon
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
    console.log(pokemon, stats);
}

function compare_stats(){
    for(let i = 0; i < stats.length; i++){
        current_stat = stats[i];
        max = 0;
        for(let j = 0; j < pokemon.length; j++){
            
        }
    }
}
function compare(args){
    handle_args(args);                  //parses arguments and saves them (global)
    console.log(pokemon_names, stats);
    fetch_pokemon();                    //fetches pokemon and stores them in pokemon
    
    compare_stats();                    //arguments are saved gloablly
}

//exports it so the module may be recieved by main
module.exports = compare;