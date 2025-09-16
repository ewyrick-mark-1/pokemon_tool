
//Broke this into its own file so it can be reused by other modules across files.

async function sleep(delay){                                                //sleep function
    return new Promise(resolve => setTimeout(resolve, delay));              //resolve promise after delay. make sure to await in fetchWithDelay.
}

async function fetchWithDelay(url, delay, attempts){                        //implements fetching with bounded retry/backoff on 429/5xx
    for (let attempt = 0; attempt < attempts; attempt++){
        const response = await fetch(url);                                  //assigns response to local variable

        if(response.ok){                                                    //if successful, return response
            return response;
        }

        if(!(response.status == 429 || response.status >= 500)){             //if error isnt 429/5xx, retry will not help, exit with code.
            console.error(`something went wrong with API call in compare.js with status ${response.status}- \n\nexiting with code 2.\n`);
            process.exit(2);                                                //code 2 for bad API
        }
        sleep(delay * (attempt ** 2));                                      //if error is 429/5xx, retry with exponientally increasing wait times. No jitter for sake of brevity
    }
    console.error(`something went wrong with API call in compare.js- \n\nexiting with code 2.\n`);
    process.exit(2);                                                        //code 2 for bad API
}

module.exports = fetchWithDelay;