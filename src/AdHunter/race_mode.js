// find the list of regular expressions for a given url
function map_url(url){
    // extract domain out of url
    // if no domain is found that means current page is not a valid website
    domain = extractDomain(url); 
    if (!domain) {
        return null
    }

    // find the host of that domain and parse it appropriately
    find_host = domain.match(/^(.+)\./);
    if (!find_host){
        return null
    }
    var hostname = find_host[1];
    if (hostname === undefined){
        console.log("Failed to find hostname for:", domain);
        return null
    } else{
        if (find_host[1].startsWith("www.")){
            hostname = hostname.slice(4,)
        }
    }
    
    // different rule for finding host name
    var alternative_hostname_match = hostname.match(/\.(\w|\d|[-])*$/)
    var alternative_hostname = alternative_hostname_match?alternative_hostname_match[0].slice(1,): "ALT NOT FOUND"

    // if hostname is in our blocked domains, return the list of regural expressions
    // otherwise it is not an ad tracker and we return null
    blocked = blocked_domains[hostname] || blocked_domains[alternative_hostname];
    if (blocked===undefined) {
        return null;
    } else { 
        return [blocked, domain, hostname || alternative_hostname];
    }
    
}


// add listener to storage value changes
chrome.storage.onChanged.addListener(function race_flag_listener(changes, namespace) {
    var game_on = false;
    var emmited = false;
    var winner = null;
    var this_game_mode = false

    // if the change that occured was gameOver=false that means a game started
    for (var key in changes) {
        var storageChange = changes[key];        
        if (key=="gameMode" && storageChange.newValue=="Race"){
            this_game_mode = true
            game_on = true
        } else if (key=="gameMode" && storageChange.newValue==null){
            this_game_mode = false
            game_on = false
        }
    } 
    if (game_on && this_game_mode) {
        var unique_trackers = []
        // Adds a listener function to all requests that match url from the blocked domains
        chrome.webRequest.onBeforeRequest.addListener(
            async function race_trackers(details) {

                // variables to determine current tab and who made the request
                var tab_id = details.tabId.toString();
                var initiator = details.initiator;
                var domain = extractDomain(initiator);

                

                // check if someone else has won the game
                chrome.storage.local.get('winner', function(winnerData){
                    winner = winnerData.winner;
                })

                // if someone else has won the game we stop counting ad trackers 
                if (winner){
                    game_on = false;
                    chrome.webRequest.onBeforeRequest.removeListener(race_trackers);
                    return
                }
                
                // find the regular expressions for this url
                var blocked_urls = map_url(details.url);
                if (!blocked_urls){
                    return
                }

                // check if tracker found is unique
                var tracker_host = blocked_urls[2];
                tracker_host = tracker_host.includes("safeframe.googlesyndication")?"safeframe.googlesyndication": tracker_host
                if (unique_trackers.includes(tracker_host)){
                    return
                }else { 
                    chrome.storage.local.set({'latestTracker': tracker_host});
                    unique_trackers.push(tracker_host)
                }

                // Add 1 to the total ad trackers number      
                chrome.storage.local.get('totalAds', function(data) {
                    chrome.storage.local.set({'totalAds': data.totalAds + 1}, function() {
                        console.log("Total ads: ", data.totalAds + 1);
                    });  
                }); 
                
                // Add 1 to the page ad trackers number
                

                // update the user's page history metrics
                chrome.storage.local.get('page_history', function(data){
                    domain = domain.includes("safeframe.googlesyndication")?"safeframe.googlesyndication": domain
                    if (data.page_history[domain]){
                        data.page_history[domain]["count"] += 1;
                        data.page_history[domain]["trackers"].push(tracker_host);
                    } else {
                        data.page_history[domain] = {"count": 1, "trackers": [tracker_host]}
                    }
                    chrome.storage.local.set({"page_history": data.page_history});
                });

                chrome.storage.local.get([tab_id], function(data) {
                    if (!data[tab_id]){
                        return
                    }
                    data[tab_id].trackers +=1;
                    if (data[tab_id].url==="other" && domain) {
                        data[tab_id].url = domain;
                    }
                    chrome.storage.local.set({[tab_id]: data[tab_id]}, function() {
                        console.log("Page ads: ", data[tab_id].trackers);
                    });  
                });
                

                // Add 1 to the game session ads
                chrome.storage.local.get('gameState', function(gameData) {
                    chrome.storage.local.get('ownerName', function(playerData) {
                        var gameState = gameData.gameState;
                        var playerName = playerData.ownerName;
                        logger.log("game", `Tracker ${tracker_host} found on ${domain}`, playerName)
                        gameState.players[playerName]["score"] += 1;
                        gameState.players[playerName]["trackers"] = unique_trackers;
                        socket.emit("sendUpdateToAllClients", {'player':playerName,'game_state':gameState});
                        chrome.storage.local.set({'gameState': gameState}, function() {
                            console.log("Game ads: ", gameState.players[playerName]["score"]);
                        });

                        // check if player has won the game and notify server accordingly
                        if (gameState.players[playerName]["score"] >= gameState.condition){
                            game_on = false;
                            this_game_mode = false;
                            chrome.webRequest.onBeforeRequest.removeListener(race_trackers);
                            console.log("FOUND ENOUGH TRACKERS!");
                            gameState['finished_at'] = new Date();
                            if (!emmited){
                                socket.emit('playerWon', {"player": playerName, "game_state": gameState})
                                chrome.storage.local.get('page_history', async function(historyData){
                                    socket.emit('playerHistory', {"player": playerName, "game_history": historyData.page_history})
                                });
                                emmited = true;    
                            }

                            chrome.storage.local.set({'winner': playerName});
                            chrome.storage.local.set({'gameMode': null});
                            chrome.storage.local.set({'postGame': gameState});
                            chrome.storage.local.set({'gameState': null});
                                                
                            return;
                        }
                          
                    });
                });
            },
            {urls: ["<all_urls>"]},
        )

         
    }
});



