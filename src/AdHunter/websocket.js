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