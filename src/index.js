//import other modules
const search = require('./search.js');
const list = require('./list.js');
const compare = require('./compare.js');

//for debugging command arguments
const args0 = process.argv[0];
const args1 = process.argv[1];
const args2 = process.argv[2];
const args3 = process.argv[3];
console.log("\nargv[0]: ", args0,"\nargv[1]: ", args1,"\nargv[2]: ", args2,"\nargv[3]: ", args3,);
console.log("\nall :", process.argv);
console.log("\nsplit :", process.argv.slice(2));

const args = process.argv.slice(2);
const size = args.length;
for(let i = 0; i < size; i++){
    console.log("arg ", i, ": ", args[i]);
}
//selects correct argument & passes it to the correct module
switch(args[0]){
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
        console.log("Invalid arguments. Exiting with code 1.");
        process.exit(1);
    break;
}