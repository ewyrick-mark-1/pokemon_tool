//import other modules
const search = require('./search.js');
const list = require('./list.js');
const compare = require('./compare.js');

const args = process.argv.slice(2);
console.log(args);
for(let i = args.length - 1; i >= 0; i--){                  //backwards loop to make splicing easier
    if(args[i].startsWith("--") && args[i] !== "--"){       //checks for inputs of the form --xyz, but not just --
        args.splice(i, 0, '--')                             //splices -- into current index
        args[i + 1] = args[i+1].slice(2);                   //removes -- from previous index. ie --xyz -> -- xyz (makes it easier to process)
    }
    console.log("arg ", i, ": ", args[i]);
}
console.log(args);
//selects correct argument & passes it to the correct module
switch(args[0]){                                            //args[0] is the base command. above loop cannot check for --basecomand, as npm fails to start correctly
    case 'search':
        search(args.slice(1));
    break;
    case 'list':
        list(args.slice(1));
    break;
    case 'compare':
        compare(args.slice(1));
    break;
    default:
        console.error("Invalid arguments. Exiting with code 1.");
        process.exit(1);
    break;
}