var socket = io.connect('http://localhost:5000');

chrome.storage.onChanged.addListener(function race_flag_listener(changes, namespace) {
    var game_on = false;
    var emmited = false;
    for (var key in changes) {
        var storageChange = changes[key];
        if (key=="gameOn"){
            game_on = storageChange.newValue;
        }         
    } 
    if (game_on) {
        // Adds a listener function to all requests that match url from the blocked domains
        chrome.webRequest.onCompleted.addListener(
            function race_trackers(details) {
                // Add 1 to the total ad trackers number      
                chrome.storage.local.get('totalAds', function(data) {
                    chrome.storage.local.set({'totalAds': data.totalAds + 1}, function() {
                        console.log("Total ads: ", data.totalAds + 1);
                    });  
                }); 
                
                // Add 1 to the page ad trackers number
                chrome.tabs.query({active: true, windowType:"normal"}, function(tab) {
                    var tab_id = tab[0].id.toString();
                    chrome.storage.local.get([tab_id], function(data) {
                        chrome.storage.local.set({[tab_id]: data[tab_id] + 1}, function() {
                            console.log("Page ads: ", data[tab_id] + 1);
                        });  
                    });
                });

                // Add 1 to the game session ads
                chrome.storage.local.get('gameState', function(gameData) {
                    chrome.storage.local.get('player', function(playerData) {
                        var gameState = gameData.gameState;
                        gameState.players[playerData.player] += 1;
                        chrome.storage.local.set({'gameState': gameState}, function() {
                            console.log("Game ads: ", gameState.players[playerData.player]);
                        });
                        if (gameState.players[playerData.player] >= gameState.condition){
                            game_on = false;
                            chrome.webRequest.onCompleted.removeListener(race_trackers);
                            console.log("FOUND ENOUGH TRACKERS!");
                            if (!emmited){
                                socket.emit('playerWon', {"player": playerData.player, "game_state": gameState})
                                emmited = true;    
                            }
                            
                            chrome.storage.local.set({'gameOn': false}); 
                            gameState['finished_at'] = new Date();
                            
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
                return {cancel: false}
            },
            {urls: blocked_domains},
        )

         
    }
});



