# What is this?

##  How to install:

## How to run:

##  How to run tests:

##  How to add a new command:

##  Project Structure:



##  AI usage:

The use of AI in this project was limited to the following:

- Research on best practices for API setup
- Research on JS specific syntax
- developing invalid command cases for testing

### commands for testing:
error codes:

- 1 : bad arguments / syntax
- 2 : API fetch error



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