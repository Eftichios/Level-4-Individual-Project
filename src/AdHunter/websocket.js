var socket = io.connect('http://localhost:5000');

socket.on('connect', ()=>{
    console.log('Connected to server')

    // check if this player was in an active game
    chrome.storage.local.get('gameState', async (game_data)=>{
        if (game_data.gameState){
            // indicate error
            chrome.storage.local.set({'error':"Disconnected from network."})
        }
    })
});

// special message to expose extension sockets to the server
socket.on('identifyExtension', async (user_data)=>{
    chrome.storage.local.get('ownerName', async function(owner_data){
        logger.log("info", `Extension socket identified from ${owner_data.ownerName}`, user_data.user_name);
        if (owner_data.ownerName && user_data.user_name === owner_data.ownerName){
            var user_id = await getUserIdFromName(owner_data.ownerName);
            // username entered correctly and matches 
            chrome.storage.local.set({'ownerId': user_id});
            socket.emit("extensionResponse", {'foundUser': true, 'user_id':user_id});
        } else {
            // the name given does not match with the player that made request
            socket.emit("extensionResponse", {'foundUser': false, 'user_id':user_data.user_id});
        }
        
    });
});

// listen to race game start event and set game state
socket.on('gameStartRace', async(game_state)=>{
    chrome.storage.local.set({'gameState': game_state});

    chrome.storage.local.set({'gameOver': false});
    chrome.storage.local.set({'gameMode': "Race"});
    chrome.storage.local.set({'winner': null});
    chrome.storage.local.set({'page_history': {}});
    chrome.storage.local.set({'postGame': null});
    chrome.storage.local.set({'error': null});

    // reset page trackers
    chrome.tabs.query({}, function(tab) {
        var temp_ads = {}
        tab.forEach(async (t) => {
          var id = t.id
          var domain = extractDomain(t.url);
          if (!domain){
            domain = "other";
          }  
          temp_ads[id] = {'url': domain, 'trackers': 0};   
        });
        chrome.storage.local.set({'tab_id_ads': temp_ads}, ()=>{
          console.log(temp_ads);
        })
      });
});

// listen to category game start event and set game state
socket.on('gameStartCategory', async(game_state)=>{
    chrome.storage.local.set({'gameState': game_state});

    chrome.storage.local.set({'gameOver': false});
    chrome.storage.local.set({'gameMode': "Category"});
    chrome.storage.local.set({'winner': null});
    chrome.storage.local.set({'page_history': {}});
    chrome.storage.local.set({'postGame': null});
    chrome.storage.local.set({'error': null});
});

// listen to updates to the game state from other players and update their score
socket.on('updateGameState', async(player_game_state) =>{
    var player_name = player_game_state.player;
    var new_game_state = player_game_state.game_state;
    chrome.storage.local.get('gameState', async function(gameData){
        try{
            if (gameData.gameState && gameData.gameState.game_mode==="Race"){
                gameData.gameState.players[player_name]["score"] = new_game_state.players[player_name]["score"];
                gameData.gameState.players[player_name]["trackers"] = new_game_state.players[player_name]["trackers"];
            } else {
                gameData.gameState.players[player_name]["categories"] = new_game_state.players[player_name]["categories"];
            }
            
            chrome.storage.local.set({'gameState': gameData.gameState});
        } catch (err){
            chrome.storage.local.set({'error': err.message})
        }
    });
});

// when a winner is found update game state and scores
// send this player's history to the server
socket.on('winnerFound', async(player_game_state)=>{
    var player_name = player_game_state.player;
    var new_game_state = player_game_state.game_state;
    chrome.storage.local.get('gameState', async function(gameData){
        if (gameData.gameState.game_mode==="Race"){
            gameData.gameState.players[player_name]["score"] = new_game_state.players[player_name]["score"];
            gameData.gameState.players[player_name]["trackers"] = new_game_state.players[player_name]["trackers"];
        } else {
            gameData.gameState.players[player_name]["categories"] = new_game_state.players[player_name]["categories"];
        }
        chrome.storage.local.set({'postGame': gameData.gameState});
        chrome.storage.local.set({'winner': player_name});
        chrome.storage.local.set({'gameState': null});   
        chrome.storage.local.set({'latestTracker': null});
        chrome.storage.local.set({'latestCategory': null});
        chrome.storage.local.set({'adCount': 0});
    });
    chrome.storage.local.get('ownerName', async function(data){
        chrome.storage.local.get('page_history', async function(historyData){
            socket.emit('playerHistory', {"player": data.ownerName, "game_history": historyData.page_history})
        });
    });     
})

// notify the extension when a user has left the lobby
socket.on("extUserLeft", async(user_data)=>{
    console.log(user_data, "LEFT");
    // check if the user that has left the lobby is the owner of this extension
    // if so, update the game states and status accordingly
    chrome.storage.local.get("ownerName", async (owner_data)=>{
        if (owner_data.ownerName === user_data.user_name){
            chrome.storage.local.set({'winner': null});
            chrome.storage.local.set({'latestTracker': null});
            chrome.storage.local.set({'latestCategory': null});
            chrome.storage.local.set({'gameMode': null});
            chrome.storage.local.set({'page_history': {}});
            chrome.storage.local.set({'gameState': null});
            chrome.storage.local.set({'postGame': null});
            logger.log("game", "User left the game", user_data.user_name);
        } else {
            // if it is not this player, remove the player that left from the game state
            chrome.storage.local.get("gameState", async (game_state_data)=>{
                if (game_state_data.gameState){
                    if (game_state_data.gameState.players[user_data.user_name]){
                        delete game_state_data.gameState.players[user_data.user_name]
                        chrome.storage.local.set({"gameState": game_state_data.gameState})
                    }
                }
            })
        }
        socket.emit("extServerUserLeft", user_data.user_name);
    })
    
    
})