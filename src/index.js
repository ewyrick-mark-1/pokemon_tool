//import other modules
const search = require('./search.js');
const list = require('./list.js');
const compare = require('./compare.js');
const parseArguments = require('./parseArguments.js');

const args = process.argv.slice(2);         //takes inputs from command line and removes non useful parts at the beggining
console.log(args);                          //log for debugging


const parsedArgs = parseArguments(args)     //parses arguments and formats them in an argument object
console.log(parsedArgs);                    //log for debugging 

let output = null;                          //init output
switch( parsedArgs.function ){              //switch based on selected function
    case 'SEARCH':
        search(parsedArgs).then(result => parsedArgs.flags.json_flag ? console.log(result) : console.log(result));        //calls search function & provides arguments. output format will be based on --json flag
    break;
    case 'LIST':
        list(parsedArgs).then(result => parsedArgs.flags.json_flag ? console.log(result) : console.log(result));          //calls list function & provides arguments. output format will be based on --json flag
    break;
    case 'COMPARE':
        compare(parsedArgs).then(result => parsedArgs.flags.json_flag ? console.log(result) : console.log(result));       //calls compare function & provides arguments. output format will be based on --json flag
    break;                                  //no default. covered in parseArguments.
}

console.log(output);
return 0;