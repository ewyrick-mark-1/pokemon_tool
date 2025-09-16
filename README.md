# What is this?
[pokemon_tool] is a program designed to allow the user to search, list and compare pokemon using a variety of arguments and commands. To achieve this, it makes use of [pokeAPI](https://pokeapi.co/). Using this tool, you can:
- search for multiple pokemon simultaneously- yielding get a table of important information and stats for each pokemon
- list all pokemon of a given type (or types) with variable page sizes
- compare however many stats you wish across as many pokemon as you would like
- output all of the above in either a table or json 

##  How to install:
**Prerequisites: [Node.js](https://nodejs.org/en)**

To install, clone this repository to your machine and open it in the IDE of your choice- I used VScode. That's it!

If you are interested in running testing on it, open terminal and run 'npm install'. This will install jest, the framework I chose for building test files.

## How to run:

make sure you are in the termaial, specifically in the project directory. The three main commands to run are the following:
- npm run start -- search
- npm run start -- list
- npm run start -- compare
- npm run start -- help

These commands respectively have the following arguments:
- npm run start -- search pokemon1 pokemon2 ... pokemonN
- npm run start -- list --type type1 type2 ... typeN --page pageNumber --pageSize pageLength
- npm run start -- compare pokemon1 pokemon2 ... pokemonN --stat stat1 stat2 ... statN

A few examples follow:
- npm run start -- search pikachu skarmory
- npm run start -- list --type electric --page 2 --pagesize 25
- npm run start -- compare pikachu charizard skarmory --stat spd def hp

More examples of commands can be found in the commands for testing section, under valid commands.
##  How to run tests:
To run some of the pre built tests, or to run your own you will need to make sure that you have jest installed. If you don't, you can install it via the command 'npm install' - this download the developer dependencies. You can run the test files included under the tests folder with the command 'npm test'. This will test search.js, compare.js, list.js, as well as parseArguments.js.

There is one known bug with testing. Sometimes, concurrent API calls can cause an output to be out of the expected order. It seems to be pretty rare, but it is possible.
##  How to add a new command:
To add a new command there are a few things you will have to do. 
1. update the switch statements in parseArguments to include your command(s), including separate functions for processing its arguments into the universal 'parsed' variable.
2. update main switch statement in index.js to pass the parsed arguments to your new file
3. create a new js file in src to implement your command.

note: I may, later down the line adjust the object parsing works so it references an external json file. That would make it much faster and more convenient to add future commands. (the current method is rather unwieldy)
##  Project Structure:
This project is structured to keep things simple and easy to read. using a general command and arguments, the general path follows:

1. command and arguments are entered in the terminal
2. these are received in index.js and sent to parseArguments.js for processing.
3. parseArguments is designed to be robust, and allow for duplicate flags, spaces between -- and the flag, as well as multiple arguments. It takes these arguments and stores them in an object named 'parsed', which is structured/initialized as follows:
{
    function : null, 
    arguments : {}, 
    flags : {
        json_flag : false, 
        no_cache : false
    }
}
4. parsed is designed to be universal across the different command files ( search.js, list.js, ect ). When index.js receives it, its function element is put through a switch statement to determine which command file should receive it.
5. once a command file receives it, it unpacks the arguments and flags to store them locally, at which point their individual logic is carried out.
6. every command file at some point calls the API, which is handled asynchronously by fetchWithDelay. This file implements fetching with bounded exponential backoff to improve consistency/reliability of API calls without overloading the server.
7. the command files output is passed back to index, at which point it is output to the terminal.

## Bugs/Things to be fixed
There are a few things that are currently pretty unoptimal. I intend to go through and fix them at some point. These include:
- non-useful in process caching in all command files. Due mostly to concurrency updates
- Testing may return a false negative if the API returns out of order
- more testing needed for API fetching. Currently have integration tests but no unit test.
- Argument parsing is in need of a more readable and modular re struture
- local JSON cache implementation is needed. flags have already been implemented.

##  AI usage:

The use of AI in this project was limited to the following:

- Research on best practices for API setup
- Research on JS specific syntax
- Research on testing libraries
- help developing invalid command cases for testing

### error codes:

error codes:

- 1 : bad arguments / syntax
- 2 : API fetch error

### commands for testing:

search:

    valid commands:
        - npm run start -- search pikachu
        - npm run start -- search pikachu skarmory
        - npm run start -- search 123
        - npm run start -- search pikachu --json

    invalid commands:
        - npm run start -- search                                               //handled   - error code 1 - NO_ARGS
        - npm run start -- search --pikachu                                     //handled   - error code 1 - INVALID_ARGS
        - npm run start -- search pikachu --page 1                              //handled   - error code 1 - INVALID_ARGS
        - npm run start -- search pikachu --                                    //handled   - error code 1 - INVALID_ARGS
        - npm run start -- search pikachu charizard --type electric             //handled   - error code 1 - INVALID_ARGS

list:

    valid commands:
        - npm run start -- list --type electric
        - npm run start -- list --type electric --page 1                        
        - npm run start -- list --type electric --page 2
        - npm run start -- list --type electric --page 1 --pagesize 20
        - npm run start -- list --type electric --page 1.5 --pagesize 20        //kinda
        - npm run start -- list --type electric --page 1 --pagesize 20.5        //kinda
        - npm run start -- list --pagesize 20 --type electric --page 1
        - npm run start -- list -- pagesize 20 -- type electric -- page 1

    invalid commands:
        - npm run start -- list                                                 //handled   - error code 1 - NO_ARGS
        - npm run start -- list --page 1                                        //handled   - error code 1 - INVALID_ARGS
        - npm run start -- list --pagesize twenty --type electric               //handled   - error code 1 - INVALID_ARGS
        - npm run start -- list --type                                          //handled   - error code 1 - NO_ARGS
        - npm run start -- list --type electric --page -1                       //handled   - error code 1 - INVALID_ARGS
        - npm run start -- list --foo bar --type electric                       //handled   - error code 1 - INVALID_ARGS
        - npm run start -- list -- pagesize twenty -- type                      //handled   - error code 1 - INVALID_ARGS

compare:

    valid commands:
        - npm run start -- compare pikachu charizard --stat speed
        - npm run start -- compare pikachu charizard --stat spd
        - npm run start -- compare pikachu charizard --stat spd def hp
        - npm run start -- compare pikachu charizard skarmory --stat spd def hp
        - npm run start -- compare pikachu charizard skarmory --stat spd def hp --compare dugtrio
        - npm run start -- compare pikachu charizard skarmory -- stat spd def hp -- compare dugtrio

    invalid commands:
        - npm run start -- compare                                              //handled   - error code 1 - NO_NAMES
        - npm run start -- compare pikachu --stat                               //handled   - errpr code 1 - NO_NAMES
        - npm run start -- compare pikachu charizard --stat 999                 //handled   - error code 1 - INVALID_ARGS
        - npm run start -- compare pikachu charizard --stat spd --compare       //handled   - ignore
        - npm run start -- compare pikachu charizard --foo bar                  //handled   - error code 1 - INVALID ARGS
        - npm run start -- compare --stat spd def hp                            //handled   - error code 1 = NO_NAMES

- note: list can behave strangley with floating point arguments, but does not break due.
