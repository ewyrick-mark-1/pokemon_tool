async function fetchList(type, page_num, page_size){
    const list_paginated = [];
    let list = await fetch(`https://pokeapi.co/api/v2/type/${type}/`);//pagination doesnt seem to do anything here
    if(!list.ok){//handles bad api request
        console.error("something went wrong with API fetch in list.js. check your arguments. exiting with code 2.\n");
        process.exit(2);
        
    }
    list = await list.json();
    for(let i = page_num * page_size; i<(page_size + page_num * page_size)&&i < list.pokemon.length; i++){

        //this is a really janky way to do it, but it feels better than calling the API again.
        const url = list.pokemon[i].pokemon.url;    //"https://pokeapi.co/api/v2/pokemon/id/"
        const id = url.slice(34, -1);               // isolates the id from the URL

        const name = list.pokemon[i].pokemon.name

        list_paginated.push({id , name});           //pushes values to 'paginated' list
        
        //console.log(list.pokemon[i].pokemon.name);
    }
    //console.log(list.pokemon.length);
    console.table(list_paginated);
    
}


function list(args){
    
    let types = [];        //keep default type null 
    let page = 1;           //assume indexing begins at 1
    let pageSize = 10;      //default page size of 10

    let flag = 0;           //input flag

    if(args[0] !== '--' || args[1].toUpperCase() !== 'TYPE'){   //inital check so flag doesnt get messed up (hopefully)
        console.error("invalid arguments. command should be of the form: \nlist -- type [electric]\nexiting with code 1.");
        process.exit(1);
    }
    //main argument loop
    for(let i = 2; i < args.length; i++){
        const current_input = args[i];
        
        
        if(current_input === '--'){
            flag ++;
        } else{
            switch(flag){
                case 0 :                                            // types input
                    types.push(current_input);                      // adds all inputs, more robust
                break;
                case 1 :                                            // page input
                    if(args[i-1].toUpperCase() === 'PAGE'){         // checks previous index for page identifier
                        if(!isNaN(current_input)){                  // makes sure the input is a number
                            page = Number(current_input);           // assigns input & casts as number
                        } else {
                            console.error("invalid arguments. command should be of the form: \nlist -- type [electric] -- page [1]\nexiting with code 1.");
                            process.exit(1);                        // basic error handling
                        }
                    }
                break;
                case 2 :                                            // pageSize input
                    if(args[i-1].toUpperCase() === 'PAGESIZE'){     // checks previous index for pageSize identifier
                        if(!isNaN(current_input)){                  // makes sure the input is a number
                            pageSize = Number(current_input);       // assigns input & casts as number
                        } else {
                            console.error("invalid arguments. command should be of the form: \nlist -- type [electric] -- page [1] -- pageSize [10]\nexiting with code 1.");
                            process.exit(1);                        // basic error handling
                        }
                    }
            }
        }

        
    }
    

    for(let i = 0; i < types.length; i++){          //loop through types selected as arguments
        fetchList(types[i],page - 1,pageSize);      //page - 1 to adjust for indexing mismatch
    }
    
}


module.exports = list;                              //exports it so the module may be recieved by main