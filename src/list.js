//defaults
let listCache = {};
let types = [];        //keep default type null 
let page = 1;          //assume indexing begins at 1
let pageSize = 10;     //default page size of 10
//special cases
let json_output = {};
let json_flag  = false;
let no_cache = false;

const INVALID_ARGS = "ERROR: invalid arguments. command should be of the form: npm run start -- list -- type [electric] -- page [1] -- pageSize [10]\n\nexiting with code 1.\n"
const BAD_API = "ERROR: something went wrong with API fetch in list.js. check your arguments. \n\nexiting with code 2.\n";
const NO_ARGS = "ERROR: No type(s) provided. \n\nexiting with code 1.\n"

async function fetchList(){
    for(let i = 0; i < types.length; i++){                                                              //loop through types selected as arguments
        const list_paginated = {};
        const type = types[i];
        let list = {};
        if(!listCache[type]){
            list = await fetch(`https://pokeapi.co/api/v2/type/${type}/`);                              //pagination doesnt seem to do anything here
            if(!list.ok){//handles bad api request
                console.error(BAD_API);
                process.exit(2);
                
            }
            list = await list.json();
            listCache[type] = list;
        }
        for(let i = page * pageSize; i<(pageSize + page * pageSize)&&i < list.pokemon.length; i++){     //itterate through the page that was pulled

            //this is a janky way to do it, I couldnt find an id value that is constained in lists.
            const url = list.pokemon[i].pokemon.url;    //"https://pokeapi.co/api/v2/pokemon/id/"
            const id = url.slice(34, -1);               // isolates the id from the URL

            const name = list.pokemon[i].pokemon.name;

            list_paginated[id] = name;                  //adds kvp to list_pagniated
        }
        if(json_flag){
            json_output[type] = list_paginated;
        }else{
            console.table(list_paginated);
        }
        
    }
    if(json_flag){
        const out = JSON.stringify(json_output);
        console.log(out);
    }
}
function handle_args(args){

    let flag = 0;                                                           //flag keeps track of what arg we are looking at (lsit : 0, page : 1, pageSize : 2)

    
    for(let i = 0; i < args.length; i++){                                   //begin index at 2 since above if statement checks the first 2 args
        const current_input = args[i];
        
        
        if(current_input === '--'){                                         //looks for --, if seen checks the following command to update flag
            if(args[i+1]){                                                  //prevent out of bounds indexing
                switch(args[i+1].toUpperCase()){                                    //note: no catch for list. I think that is fine.
                    case 'TYPE':                                            //looks for option type
                        flag = 0;
                        i++;                                                //skip and index (we already checked i + 1)
                    break;
                    case 'PAGE':                                            //looks for option page
                        flag = 1;
                        i++;                                                //skip and index (we already checked i + 1)
                    break;
                    case 'PAGESIZE':                                        //looks for option pageSize
                        flag = 2;
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
            } else {
                console.error(INVALID_ARGS);
                process.exit(1);
            }                               
        } else{
            switch(flag){
                case 0 :                                                            // types input
                    types.push(current_input);                                      // adds all inputs, more robust
                break;
                case 1 :                                                            // page input
                    if(args[i-1].toUpperCase() === 'PAGE'){                         // checks previous index for page identifier. only one input allowed (most recent will rewrite)
                        if(!isNaN(current_input) && Number(current_input) > 0){     // makes sure the input is a number
                            page = Number(current_input);                           // assigns input & casts as number
                        } else {
                            console.error(INVALID_ARGS);
                            process.exit(1);                                        // basic error handling
                        }
                    }
                break;
                case 2 :                                                            // pageSize input
                    if(args[i-1].toUpperCase() === 'PAGESIZE'){                     // checks previous index for pageSize identifier. only one input allowed (most recent will rewrite)
                        if(!isNaN(current_input)&& Number(current_input) > 0){      // makes sure the input is a number
                            pageSize = Number(current_input);                       // assigns input & casts as number
                        } else {
                            console.error(INVALID_ARGS);
                            process.exit(1);                                        // basic error handling
                        }
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

    if(types.length === 0){
        console.error(NO_ARGS);                                //no arguments condition
        process.exit(1);
    }
}

function list(args){

    handle_args(args);                              //parses arguments into useful data
    fetchList();
    
    
}


module.exports = list;                              //exports it so the module may be recieved by main