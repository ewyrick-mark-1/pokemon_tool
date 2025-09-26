//import other modules
const search = require('./search.js');
const list = require('./list.js');
const compare = require('./compare.js');
const parseArguments = require('./parseArguments.js');
const inputConfiguration = Object.freeze(require('../references/inputConfiguration.json'));     //import the configuration file. freezes it since it is only being read from

const args = process.argv.slice(2);         //takes inputs from command line and removes non useful parts at the beginning
//console.log(args);                        //log for debugging
let parsedArgs = {}
if(args.length === 0){                      //no command error catch
    console.error("no command entered. make sure npm run start -- command. exiting with code 1.")
    process.exit(1);
}
try {
  parsedArgs = parseArguments(args)         //parses arguments and formats them in an argument object
}catch(err){
    console.error(err.message);
    process.exit(err.errorCode);
}

if(!(parsedArgs.main_command === 'HELP')){    //prevents error from accessing function name for help.
    const functionName = inputConfiguration.commands[parsedArgs.main_command].function_name;
    const commandFunction = require(`./${functionName}`);

    if(commandFunction){
        commandFunction(parsedArgs)
            .then(result => parsedArgs.global_flags["JSON"] ? console.log(result) : console.table(result))        //calls commandFunction & provides arguments. output format will be based on --json flag
            .catch(err =>{
                console.error(err.message);
                process.exit(err.errorCode);
            });
    }
}


return 0;