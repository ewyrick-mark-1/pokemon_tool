//defaults
let types = [];        //keep default type null 
let page = 1;          //assume indexing begins at 1
let pageSize = 10;     //default page size of 10

const INVALID_ARGS = "invalid arguments. command should be of the form: \nnpm run start -- list -- type [electric] -- page [1] -- pageSize [10]\nexiting with code 1."
const BAD_API = "something went wrong with API fetch in list.js. check your arguments. exiting with code 2.\n";

async function fetchList(type, page_num, page_size){
    const list_paginated = [];
    let list = await fetch(`https://pokeapi.co/api/v2/type/${type}/`);//pagination doesnt seem to do anything here
    if(!list.ok){//handles bad api request
        console.error(BAD_API);
        process.exit(2);
        
    }
    list = await list.json();
    for(let i = page_num * page_size; i<(page_size + page_num * page_size)&&i < list.pokemon.length; i++){

        //this is a janky way to do it, I couldnt find an id value that is constained in lists.
        const url = list.pokemon[i].pokemon.url;    //"https://pokeapi.co/api/v2/pokemon/id/"
        const id = url.slice(34, -1);               // isolates the id from the URL

        const name = list.pokemon[i].pokemon.name

        list_paginated.push({id , name});           //pushes values to 'paginated' list (array of objects with id and name)
    }
    //console.log(list.pokemon.length);
    console.table(list_paginated);
    
}
function handle_args(args){

    let flag = 0;                                                           //flag keeps track of what arg we are looking at (lsit : 0, page : 1, pageSize : 2)

    
    for(let i = 0; i < args.length; i++){                                   //begin index at 2 since above if statement checks the first 2 args
        const current_input = args[i];
        
        
        if(current_input === '--'){                                         //looks for --, if seen checks the following command to update flag
            switch(args[i+1].toUpperCase()){                                    //note: no catch for list. I think that is fine.
                case 'TYPE':                                                //looks for option type
                    flag = 0;
                    i++;                                                    //skip and index (we already checked i + 1)
                break;
                case 'PAGE':                                                //looks for option page
                    flag = 1;
                    i++;                                                    //skip and index (we already checked i + 1)
                break;
                case 'PAGESIZE':                                            //looks for option pageSize
                    flag = 2;
                    i++;                                                    //skip and index (we already checked i + 1)
                break;
                default:                                                    //error catchall
                    console.error(INVALID_ARGS);
                    process.exit(1);
                break;
            }                               
        } else{
            switch(flag){
                case 0 :                                            // types input
                    types.push(current_input);                      // adds all inputs, more robust
                break;
                case 1 :                                            // page input
                    if(args[i-1].toUpperCase() === 'PAGE'){         // checks previous index for page identifier. only one input allowed (most recent will rewrite)
                        if(!isNaN(current_input)){                  // makes sure the input is a number
                            page = Number(current_input);           // assigns input & casts as number
                        } else {
                            console.error(INVALID_ARGS);
                            process.exit(1);                        // basic error handling
                        }
                    }
                break;
                case 2 :                                            // pageSize input
                    if(args[i-1].toUpperCase() === 'PAGESIZE'){     // checks previous index for pageSize identifier. only one input allowed (most recent will rewrite)
                        if(!isNaN(current_input)){                  // makes sure the input is a number
                            pageSize = Number(current_input);       // assigns input & casts as number
                        } else {
                            console.error(INVALID_ARGS);
                            process.exit(1);                        // basic error handling
                        }
                    }
                break;
                default:
                    console.error(INVALID_ARGS);                    //error catchall
                    process.exit(1);
                break;
            }
        }   
    }
}

function list(args){

    handle_args(args);                              //parses arguments into useful data

    for(let i = 0; i < types.length; i++){          //loop through types selected as arguments
        fetchList(types[i],page - 1,pageSize);      //page - 1 to adjust for indexing mismatch
    }
    
}


module.exports = list;                              //exports it so the module may be recieved by main