//function to loop through types & return them as a single array
function processTypes(types){
    let typelist = new Array;
    for(let i = 0; i < types.length; i++){
        typelist.push(types[i].type.name);
    }
    return typelist;
}

//function to fetchPokemon, outputs basic profile
async function fetchPokemon(name){
    console.log("searching for :", name);
    let pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`);
    if(!pokemon.ok){//handles bad api request
        console.error("something went wrong with API call in search.js - exiting with code 2.\n");
        process.exit(2);
    }
        pokemon = await pokemon.json();
        
        //builds array of needed values
        let stats = {
            "id": pokemon.id,
            "name": pokemon.name,
            "types": processTypes(pokemon.types).join(", "),
            "height (m)": (pokemon.height * 0.1).toFixed(3), //adjusts to standard measurments & limits precision
            "weight (kg)": (pokemon.weight * 0.1).toFixed(3),
            "base hp": pokemon.stats[0].base_stat, // 0 is base hp
            "base atk": pokemon.stats[1].base_stat,
            "base def": pokemon.stats[2].base_stat,
            "base SpA": pokemon.stats[3].base_stat,
            "base SpD": pokemon.stats[4].base_stat,
            "base Spe": pokemon.stats[5].base_stat,
            
        }
        console.table(stats);
        
    
    
    
    
}

function search(args){
    for(let i = 0; i < args.length; i++){
        fetchPokemon(args[i]);
    }
    
    
}

//exports it so the module may be recieved by main
module.exports = search;