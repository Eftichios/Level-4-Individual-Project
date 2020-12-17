function map_url(url){
    domain = extractDomain(url); 
    if (!domain) {
        return null
    }
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
    
    var alternative_hostname_match = hostname.match(/\.(\w|\d|[-])*$/)
    var alternative_hostname = alternative_hostname_match?alternative_hostname_match[0].slice(1,): "ALT NOT FOUND"

    blocked = blocked_domains[hostname] || blocked_domains[alternative_hostname];
    if (blocked===undefined) {
        return null;
    } else { 
        return blocked;
    }
    
}


chrome.storage.onChanged.addListener(function race_flag_listener(changes, namespace) {
    var game_on = false;
    var emmited = false;
    var winner = null;
    for (var key in changes) {
        var storageChange = changes[key];
        if (key=="gameOver" && storageChange.newValue!==null){
            game_on = !storageChange.newValue;
        }         
    } 
    if (game_on) {
        // Adds a listener function to all requests that match url from the blocked domains
        chrome.webRequest.onBeforeRequest.addListener(
            function race_trackers(details) {
                // check if someone else has won the game
                chrome.storage.local.get('winner', function(winnerData){
                    winner = winnerData.winner;
                })

                if (winner){
                    console.log(winner);
                    game_on = false;
                    chrome.webRequest.onBeforeRequest.removeListener(race_trackers);
                    return
                }
                

                var blocked_urls = map_url(details.url);
                if (!blocked_urls){
                    return
                }
                
                // Add 1 to the total ad trackers number      
                chrome.storage.local.get('totalAds', function(data) {
                    chrome.storage.local.set({'totalAds': data.totalAds + 1}, function() {
                        console.log("Total ads: ", data.totalAds + 1);
                    });  
                }); 
                
                // Add 1 to the page ad trackers number
                var tab_id = details.tabId.toString();
                var initiator = details.initiator;
                var domain = extractDomain(initiator);
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
                        gameState.players[playerName] += 1;
                        socket.emit("sendUpdateToAllClients", {'player':playerName,'game_state':gameState});
                        chrome.storage.local.set({'gameState': gameState}, function() {
                            console.log("Game ads: ", gameState.players[playerName]);
                        });
                        if (gameState.players[playerName] >= gameState.condition){
                            game_on = false;
                            chrome.webRequest.onBeforeRequest.removeListener(race_trackers);
                            console.log("FOUND ENOUGH TRACKERS!");
                            gameState['finished_at'] = new Date();
                            if (!emmited){
                                socket.emit('playerWon', {"player": playerName, "game_state": gameState})
                                emmited = true;    
                            }

                            chrome.storage.local.set({'winner': playerName});
                            chrome.storage.local.set({'gameOver': true});
                                                
                            return;
                        }
                          
                    });
                });
                
                // make a POST request to the server
                // with the details of the request
                // fetch('http://localhost:5000/extension', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                //     body: JSON.stringify(details),
                //     })
                //     .then(response => {
                //         console.log(response);
        
                //     })
                // return
            },
            {urls: ["<all_urls>"]},
        )

         
    }
});



