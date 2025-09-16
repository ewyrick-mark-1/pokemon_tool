//globals

const allowed_stats = {                                         //list of allowed stats. key-value paired. For a check in compare
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

let parsed = {                                                  //final parsed object. kept global for simplicity. but reset each time ran.
    function : null, 
    arguments : {}, 
    flags : {
        json_flag : false, 
        no_cache : false
    }
};

function isStat(stat){                                          // checks if stat is in allowed_stats
    return  stat.toUpperCase() in allowed_stats;                // checks entered key against allowed ones
}

function parseSearch(args){                                     //function for parsing search arguments and storing them in parsed obj
    
    let flag = 0;                                                           //flag keeps track of what arg we are looking at (search : 0, json : -1, no_cache : -2)

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
                        parsed.flags.json_flag = true;
                        i++;                                                //skip and index (we already checked i + 1)
                    break;
                    case 'NO-CACHE':                                        //looks for option no-cache
                        flag = -2;
                        parsed.flags.no_cache = true;
                        i++;                                                //skip and index (we already checked i + 1)
                    break;
                    default:                                                //error catchall
                        const error = new Error(`Unknown Command: -- ${args[i+1]}. Exiting with code 1.`);
                        error.errorCode = 1;
                        throw error;
                    break;
                }
            }else{
                const error = new Error('Trailing --. Exiting with code 1.');
                error.errorCode = 1;
                throw error;
            }                               
        }else{
            switch(flag){
                case 0 :                                                    // types input
                    parsed.arguments.pokemon_names.push(current_input);     // adds all types as inputs in pokemon_names field
                break;
                case -1 :                                                   // JSON output selected
                    if(current_input){                                      // should not be any arguments. just a flag. unnecessary case- indluded for completness
                        const error = new Error(`Unknown Command: --json ${args[i]}. Exiting with code 1.`);
                        error.errorCode = 1;
                        throw error;
                    }
                break;
                case -2 :                                                   // no-cache selected
                    if(current_input){                                      // should not be any arguments. just a flag. unnecessary case- indluded for completness
                        const error = new Error(`Unknown Command: --no-cache ${args[i]}. Exiting with code 1.`);
                        error.errorCode = 1;
                        throw error;
                    }
                break;
                default:                                                    //error catchall
                    const error = new Error(`Invalid Argument: ${args[i]}. Exiting with code 1.`);
                    error.errorCode = 1;
                    throw error;
                break;
            }
        }
    }
    if(parsed.arguments.pokemon_names.length === 0){                        //no input
        const error = new Error('No arguments provided. Exiting with code 1.');
        error.errorCode = 1;
        throw error;
    }

}

function parseList(args){                                       //function for parsing list arguments and storing them in parsed obj
    
    let flag = 0;                                                           //flag keeps track of what arg we are looking at (list : 0, page : 1, pageSize : 2, json : -1, no_cache : -2)
    
    for(let i = 0; i < args.length; i++){
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
                        parsed.flags.json_flag = true;                      //assign flag
                        i++;                                                //skip and index (we already checked i + 1)
                    break;
                    case 'NO-CACHE':                                        //looks for option no-cache
                        flag = -2;
                        parsed.flags.no_cache = true;                       //assign no-cache
                        i++;                                                //skip and index (we already checked i + 1)
                    break;
                    default:                                                //error catchall
                        const error = new Error(`Unknown Command: -- ${args[i+1]}. Exiting with code 1.`);
                        error.exitCode = 1;
                        throw error;
                    break;
                }
            } else {
                const error = new Error(`Trailing --. Exiting with code 1.`);
                error.errorCode = 1;
                throw error;
            }                               
        } else{
            switch(flag){
                case 0 :                                                            // types input
                    parsed.arguments.types.push(current_input);                     // adds all inputs, more robust
                break;
                case 1 :                                                            // page input
                    if(args[i-1].toUpperCase() === 'PAGE'){                         // checks previous index for page identifier. only one input allowed (most recent page call will rewrite, but only the index after the call)
                        if(!isNaN(current_input) && Number(current_input) > 0){     // makes sure the input is a number 1 or greater
                            parsed.arguments.page = Number(current_input) - 1;                       // assigns input & casts as number, -1 to adjust for index by 0
                        } else {
                            const error = new Error(`Invalid Argument: ${args[i]}. Exiting with code 1.`);
                            error.errorCode = 1;
                            throw error;                                            // basic error handling
                        }
                    } else {
                        const error = new Error(`Invalid Argument: ${args[i]}. Exiting with code 1.`);
                        error.errorCode = 1;
                        throw error; 
                    }
                break;
                case 2 :                                                            // pageSize input
                    if(args[i-1].toUpperCase() === 'PAGESIZE'){                     // checks previous index for pageSize identifier. only one input allowed (most recent pageSize call will rewrite, but only the index after the call)
                        if(!isNaN(current_input)&& Number(current_input) > 0){      // makes sure the input is a number
                            parsed.arguments.pageSize = Number(current_input);                       // assigns input & casts as number
                        } else {
                            const error = new Error(`Invalid Argument: ${args[i]}. Exiting with code 1.`);
                            error.errorCode = 1;
                            throw error;                                            // basic error handling
                        }
                    }else {
                        const error = new Error(`Invalid Argument: ${args[i]}. Exiting with code 1.`);
                        error.errorCode = 1;
                        throw error; 
                    }
                break;
                case -1 :                                                           // JSON output selected
                    if(current_input){                                              // should not be any arguments. just a flag. unnecessary case- indluded for completness
                        const error = new Error(`Unknown Command: --json ${args[i]}. Exiting with code 1.`);
                        error.errorCode = 1;
                        throw error;
                    }
                break;
                case -2 :                                                           // no-cache selected
                    if(current_input){                                              // should not be any arguments. just a flag. unnecessary case- indluded for completness
                        const error = new Error(`Unknown Command: --no-cache ${args[i]}. Exiting with code 1.`);
                        error.errorCode = 1;
                        throw error;
                    }
                break;
                default:
                    const error = new Error(`Invalid Argument: ${args[i]}. Exiting with code 1.`);                    //error catchall
                    error.errorCode = 1;
                    throw error;
                break;
            }
        }   
    }

    if(parsed.arguments.types.length === 0){
        const error = new Error(`Invalid Number of Arguments. Exiting with code 1.`);                                //no arguments condition
        error.errorCode = 1;
        throw error;
    }
}

function parseCompare(args){                                    //function for parsing compare arguments and storing them in parsed obj
    let flag = 0;                                                           //flag keeps track of what arg we are looking at (compare : 0, stat : 1, json : -1, no_cache : -2)


    //main argument loop
    for(let i = 0; i < args.length; i++){
        const current_input = args[i];
        
        
        if(current_input === '--'){                                         //looks for --, if seen checks the following command to update flag
            if(args[i+1]){                                                  //prevent out of bounds indexing
                switch(args[i+1].toUpperCase()){                        
                    case 'COMPARE':                                         //should never reach. unless --comapre a b --stat c --comapre d (would add third pokemon to the list)
                        flag = 0;
                        i++;                                                //skip and index (we already checked i + 1)
                    break;
                    
                    case 'STAT':                                            //main thing to look for.
                        flag = 1;
                        i++;                                                //skip and index (we already checked i + 1)
                    break;
                    case 'JSON':                                            //looks for option json
                        flag = -1;
                        parsed.flags.json_flag = true;
                        i++;                                                //skip and index (we already checked i + 1)
                    break;
                    case 'NO-CACHE':                                        //looks for option no-cache
                        flag = -2;
                        parsed.flags.no_cache = true;
                        i++;                                                //skip and index (we already checked i + 1)
                    break;
                    default:                                                //error catchall
                        const error = new Error(`Unknown Command: -- ${args[i+1]}. Exiting with code 1.`);
                        error.errorCode = 1;
                        throw error;
                    break;
                }                              
            }else{
                    const error = new Error(`Trailing --. Exiting with code 1.`);
                    error.errorCode = 1;
                    throw error;
            } 
        } else{
            switch(flag){                                           
                case 0 :                                                    // pokemon input
                    parsed.arguments.pokemon_names.push(current_input);     // adds all pokemon inputs, more robust
                break;
                case 1 :                                                    // stat input
                        if(isStat(current_input)){                          // makes sure the input is a valid stat
                            parsed.arguments.stats.push(current_input);     // assigns input to stat. **does not check for duplicates**
                        } else {
                            const error = new Error(`Invalid stat: ${args[i]}. Exiting with code 1.`);
                            error.errorCode = 1;
                            throw error;                                // basic error handling
                        }
                break;
                case -1 :                                                    // JSON output selected
                    if(current_input){                                       // should not be any arguments. just a flag. unnecessary case- indluded for completness
                        const error = new Error(`Unknown Command: --json ${args[i]}. Exiting with code 1.`);
                        error.errorCode = 1;
                        throw error;
                    }
                break;
                case -2 :                                                    // no-cache selected
                    if(current_input){                                       // should not be any arguments. just a flag. unnecessary case- indluded for completness
                        const error = new Error(`Unknown Command: --no-cache ${args[i]}. Exiting with code 1.`);
                        error.errorCode = 1;
                        throw error;
                    }
                break;
                default:                                                     //error catchall
                    const error = new Error(`Invalid Argument: ${args[i]}. Exiting with code 1.`);
                    error.errorCode = 1;
                    throw error;
                break;
            }
        }   
    }
    if(parsed.arguments.pokemon_names.length <= 1){                         //no/too few arguments condition
        const error = new Error(`Too few pokemon. Exiting with code 1.`); 
        error.errorCode = 1;
        throw error;
    }
    if(parsed.arguments.stats.length === 0){                                //no arguments condition
        const error = new Error(`No stats provided to compare. Exiting with code 1.`); 
        error.errorCode = 1;
        throw error;
    }
}

function parseArguments(args){
    parsed = {                                                  //make sure reset in case called multiple times.
        function : null, 
        arguments : {}, 
        flags : {
            json_flag : false, 
            no_cache : false
        }
    };

    for(let i = args.length - 1; i >= 0; i--){                  //backwards loop to make splicing easier
        if(args[i].startsWith("--") && args[i] !== "--"){       //checks for inputs of the form --xyz, but not just --
            args.splice(i, 0, '--')                             //splices -- into current index
            args[i + 1] = args[i+1].slice(2);                   //removes -- from previous index. ie --xyz -> -- xyz (makes it easier to process)
        }
    }
    
    switch(args[0].toUpperCase()){                              //args[0] is the base command. above loop cannot check for --basecomand, as npm fails to start correctly, so input required to be -- basecommand
    
    case 'SEARCH':                                              //sets up parsed to be the form that search will require
        parsed['function'] = 'SEARCH';
        parsed['arguments'] = {
            'pokemon_names' : []
        }
        parseSearch(args.slice(1));
    break;
    case 'LIST':                                                //sets up parsed to be the form that list will require
        parsed['function'] = 'LIST';
        parsed['arguments'] = {
            'types'         : [],
            'page'          : 0,
            'pageSize'      : 10,
        }
        parseList(args.slice(1));
    break;
    case 'COMPARE':                                             //sets up parsed to be the form that compare will require
        parsed['function'] = 'COMPARE';
        parsed['arguments'] = {
            'pokemon_names' : [],
            'stats'         : [],
        }

        parseCompare(args.slice(1));
    break;
    
    case 'HELP':                                                //simple help statement
        console.log("Valid commands:\n\nnpm run start -- search pikachu\nnpm run start -- list --type electric --page 1 --pageSize 10\nnpm run start -- compare pikachu charizard --stat speed\n\nfor more guidance, visit the README.");
        process.exit(0);                                        //valid retrun
    break;
    default:
        const error = new Error(`Unknown Command: ${args[0]}. If you need help, enter npm run start -- help. Exiting with code 1.`);
        error.errorCode = 1;
        throw error;
    break;
    }

    return parsed;
}
//exports it so the module may be recieved by main
module.exports = parseArguments;