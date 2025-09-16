//imported fucntions
const fetchWithDelay = require('./fetchWithDelay.js');  //fetchWithDelay(url, wait, attempts)
//globals
const concurrent_limit = 5;

function tableFormat(output){                                                                           //function to better format output for tables. page would run long otherwise.
    let formattedOutput = [];

    for (type in output) {
        for (id in output[type]) {
            formattedOutput.push({'type': type, 'id': id, 'name': output[type][id]});                   //four col, | index | type | id | name|
    }
  }

  return formattedOutput;

}
async function fetchList(types){
    let listCache = {};
    const promises = types.map( async (type) => {
        if(!listCache[type]){                                                                           //checks local cache
            
            try{
                let list = await fetchWithDelay(`https://pokeapi.co/api/v2/type/${type}/`, 500 , 5);    //pagination doesnt seem to do anything here, I tried following the documentation but it returned the same size no matter what I did.
                list = await list.json();
                listCache[type] = list;                                                                 //cache the pulled list into global cache
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
    return listCache;
}

function formatList(listCache, page, pageSize,json_flag, no_cache){
    output = {};
    for(pokemon_type in listCache){                                                                     //iterate through cache

        list = listCache[pokemon_type];
        list_paginated = {};

        for(let i = page * pageSize; i<(pageSize + page * pageSize)&&i < list.pokemon.length; i++){     //itterate through the page that was pulled

            //this is a janky way to do it, I couldnt find an id value that is constained in lists.
            const url = list.pokemon[i].pokemon.url;                                                    //"https://pokeapi.co/api/v2/pokemon/id/"
            const id = url.slice(34, -1);                                                               // isolates the id from the URL

            const name = list.pokemon[i].pokemon.name;                                                  // name of the selected pokemon

            list_paginated[id] = name;                                                                  //adds kvp to list_pagniated
        }
        output[pokemon_type] = list_paginated;
    }

    if(json_flag){
        output = JSON.stringify(output);
    }else{
        output = tableFormat(output)
    }
    return output;
}




async function list(args){
    const types = args.arguments.types;                                 //assign inputs to more readable variables
    const page = args.arguments.page;
    const pageSize = args.arguments.pageSize; 
    
    const json_flag  = args.flags.json_flag;                            //assign flags
    const no_cache = args.flags.no_cache;

    let listCache = {};
        
    listCache = await fetchList(types);                                             //wait for fetching (one at a time)
    const output = formatList(listCache, page, pageSize, json_flag, no_cache);      //formats list into names and IDs for output

    return output;
    
    
}


module.exports = list;                              //exports it so the module may be recieved by main