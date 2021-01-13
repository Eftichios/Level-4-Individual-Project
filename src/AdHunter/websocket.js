var socket = io.connect('http://localhost:5000');

socket.on('connect', ()=>{
    console.log('Connected to server')
});

// special message to expose extension sockets to the server
socket.on('identifyExtension', async (data)=>{
    chrome.storage.local.get('ownerName', async function(data){

        var user_id = await getUserIdFromName(data.ownerName);
        chrome.storage.local.set({'ownerId': user_id});
        socket.emit("extensionResponse", {'foundUser': user_id?user_id:false, 'user_id':user_id});
    });
});

// listen to game start event and set game state
socket.on('gameStartRace', async(game_state)=>{
    chrome.storage.local.set({'gameState': game_state}, function() {
        console.log("Initialise game state", game_state);
    }); 

    chrome.storage.local.set({'gameOver': false});
    chrome.storage.local.set({'gameMode': "Race"});
    chrome.storage.local.set({'winner': null});
    chrome.storage.local.set({'page_history': {}});
});

socket.on('gameStartCategory', async(game_state)=>{
    chrome.storage.local.set({'gameState': game_state}, function() {
        console.log("Initialise game state", game_state);
    }); 

    chrome.storage.local.set({'gameOver': false});
    chrome.storage.local.set({'gameMode': "Category"});
    chrome.storage.local.set({'winner': null});
    chrome.storage.local.set({'page_history': {}});
});

// listen to updates to the game state from other players and update their score
socket.on('updateGameState', async(player_game_state) =>{
    var player_name = player_game_state.player;
    var new_game_state = player_game_state.game_state;
    chrome.storage.local.get('gameState', async function(gameData){
        gameData.gameState.players[player_name]["score"] = new_game_state.players[player_name]["score"];
        chrome.storage.local.set({'gameState': gameData.gameState});
    });
});

// when a winner is found update game state and scores
// send this player's history to the server
socket.on('winnerFound', async(player_game_state)=>{
    var player_name = player_game_state.player;
    var new_game_state = player_game_state.game_state;
    chrome.storage.local.get('gameState', async function(data){
        data.gameState.players[player_name]["score"] = new_game_state.players[player_name]["score"];
        chrome.storage.local.set({'gameState': data.gameState});
        chrome.storage.local.set({'winner': player_name});
        chrome.storage.local.set({'gameOver': true});      
    });
    chrome.storage.local.get('ownerName', async function(data){
        chrome.storage.local.get('page_history', async function(historyData){
            socket.emit('playerHistory', {"player": data.ownerName, "game_history": historyData.page_history})
        });
    });     
})

// notify the extension when a user has left the lobby
socket.on("extUserLeft", async(user_data)=>{
    console.log(user_data);

    // check if the user that has left the lobby is the owner of this extension
    // if so, update the game states and status accordingly
    chrome.storage.local.get("ownerName", async (owner_data)=>{
        if (owner_data.ownerName === user_data.user_name){
            chrome.storage.local.set({'winner': null});
            chrome.storage.local.set({'gameOver': true});
            chrome.storage.local.set({'gameMode': null});
            chrome.storage.local.set({'page_history': {}});
            chrome.storage.local.set({'gameState': null});
        } else {
            // if it is not this player, remove the player that left from the game state
            chrome.storage.local.get("gameState", async (game_state_data)=>{
                if (game_state_data.gameState.players[user_data.user_name]){
                    delete game_state_data.gameState.players[user_data.user_name]
                    console.log(game_state_data.gameState)
                    chrome.storage.local.set({"gameState": game_state_data.gameState})
                }
            })
        }
    })
    
    socket.emit("extServerUserLeft", (data_)=>{
        console.log(data_)
    })
})