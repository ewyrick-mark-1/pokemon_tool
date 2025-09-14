//import other modules
const search = require('./search.js');
const list = require('./list.js');
const compare = require('./compare.js');

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
        console.error("Invalid arguments. Exiting with code 1.");
        process.exit(1);
    break;
}