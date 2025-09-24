//globals

const inputConfiguration = Object.freeze(require('../references/inputConfiguration.json'));     //import the configuration file. freezes it since it is only being read from


function parseArguments(args){

    let parsed = {                                                              //init parsed/most general form
        main_command : null, 
        arguments : {}, 
        global_flags : {
            "JSON" : false, 
            "NO-CACHE" : false
        }
    };

    for(let i = args.length - 1; i >= 0; i--){                                  //backwards loop to make splicing easier
        if(args[i].startsWith("--") && args[i] !== "--"){                       //checks for inputs of the form --xyz, but not just --
            args.splice(i, 0, '--')                                             //splices -- into current index
            args[i + 1] = args[i+1].slice(2);                                   //removes -- from previous index. ie --xyz -> -- xyz (makes it easier to process)
        }
    }

    const MAIN_COMMAND = args[0].toUpperCase();                                                                             //MAIN_COMMAND is the primary command used the command line. ie list, compare, search
    if((MAIN_COMMAND in inputConfiguration.commands)){
        if(MAIN_COMMAND === 'HELP'){                                                                                        //help special case, output help text to terminal and quit
            console.log(inputConfiguration.commands.HELP.help_text);
            return 0;
        }
        parsed.main_command = MAIN_COMMAND;                                                                                 //start building parsed- set the main command
        parsed.arguments = {...inputConfiguration.commands[MAIN_COMMAND].argument_list};                                    //start building parsed- init the arguments and their types

        let current_command = MAIN_COMMAND;                                                                                 //we will change this based on the current command, but init it as the main command
        
            for(let i = 1; i < args.length; i++){
                
                if(args[i] === '--' ){                                                                                      //**command input** ( -- signifies new command or flag)
                    if(args[i+1] === undefined){                                                                            //error null command / trailing --. must be first to catch null/undefined
                        
                        const error = new Error(`Trailing --. Exiting with code 1.`);
                        error.errorCode = 1;
                        throw error;

                    }else if(args[i+1].toUpperCase() in inputConfiguration.commands[MAIN_COMMAND].argument_list){           //if the input after -- is a command in config file, assign it to current command
                        current_command = args[i+1].toUpperCase();
                        i++;                                                                                                //increment one extra to account for checking the next index
                    }else if(args[i+1].toUpperCase() in inputConfiguration.global_flags){                                   //if the input after -- is a flag in config file, set that flag to true in parsed
                        
                        if(args[i+2] !== undefined && args[i+2] !== '--'){                                                  //if there is a value after the flag that is not another --, invalid input
                            //if arguments after global flag
                            const error = new Error(`Unknown Command: -- ${args[i+1]} ${args[i+2]}. Exiting with code 1.`);
                            error.errorCode = 1;
                            throw error;
                        }

                        current_command = args[i+1].toUpperCase();                                                          //iffy on this- I think it is safer to update the current command when there is a flag, but It should not matter since we check for i+2 variables          
                        parsed.global_flags[current_command] = true;                                                        //set flag to true
                        i++;

                    }else{                                                                                                  //error invalid command. --command where command is not recognized 
                        
                        const error = new Error(`Unknown Command: -- ${args[i+1]}. Exiting with code 1.`);
                        error.errorCode = 1;
                        throw error;
                    }

                }else{                                                                                                      //**argument input**
                    let specified_input = inputConfiguration.commands[MAIN_COMMAND].argument_list[current_command];         //for referencing correct configuration and catching some input errors while parsing. 
                    let specified_input_min = inputConfiguration.commands[MAIN_COMMAND].argument_min[current_command];
                    let specified_input_max = inputConfiguration.commands[MAIN_COMMAND].argument_max[current_command];
                    let specified_input_type = inputConfiguration.commands[MAIN_COMMAND].argument_types[current_command];

                    const isArray = Array.isArray(specified_input);                                                         //specify if the input is of type array so adding values to parsed, which has cloned the template in inputConfiguration, does not go wrong.
                    
                    const input_type = !(isNaN(args[i])) ? "number" : typeof(args[i]);                                      //user input value type
                    
                    if(specified_input_type === input_type){                                                                //is the use input of the correct type compared to config?
                        if(!isNaN(args[i])){                                                                                //is input a number?
                            if(args[i] > specified_input_min && args[i] < specified_input_max){                             //is the input within specified bounds?
                                                                                                                            //if conditions are met, add that value(push if array, set equal if not) This has an interesting side effect - if I have "--page 1 2" in my inputs, 2 will take precedence.
                                isArray ? parsed.arguments[current_command].push(Number(args[i])) : parsed.arguments[current_command] = Number(args[i]);
                            
                            }else {                                                                                         //error, input not within bounds
                                const error = new Error(`Invalid Argument, not within minimum of ${specified_input_min} and maximum of ${specified_input_max}: ${args[i]}. Exiting with code 1.`);
                                error.errorCode = 1;
                                throw error;
                            }
                            
                        }else {                                                                                             //input is non a number & the correct type, add value via push or set equal depending on if stored in an array.
                            isArray ? parsed.arguments[current_command].push(args[i]) : parsed.arguments[current_command] = args[i];
                        }
                        
                    }else{                                                                                                  //error, input not the correct type
                        console.log(`incorrect type: ${typeof(args[i])}\n`)
                        const error = new Error(`Invalid Argument, wrong data type: ${args[i]}. Exiting with code 1.`);
                        error.errorCode = 1;
                        throw error;
                    }
                }
            }

            //console.log(parsed);//for debugging
            return parsed;
    }else{                                                                                                                  //invalid command
        const error = new Error(`Unknown Command: ${args[0]}. If you need help, enter npm run start -- help. Exiting with code 1.`);
        error.errorCode = 1;
        throw error;
    }


}
//exports it so the module may be received by main
module.exports = parseArguments;

