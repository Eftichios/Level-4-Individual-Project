var socket = io.connect('http://localhost:5000');

socket.on('connect', ()=>{
    console.log('Connected to server')
});

socket.on('identifyExtension', async (data)=>{
    chrome.storage.local.get('ownerName', async function(data){

        var user_id = await getUserIdFromName(data.ownerName);
        chrome.storage.local.set({'ownerId': user_id});
        socket.emit("extensionResponse", {'foundUser': user_id?user_id:false, 'user_id':user_id});
    });
});

socket.on('gameStart', async(game_state)=>{
    chrome.storage.local.set({'gameState': game_state}, function() {
        console.log("Initialise game state", game_state);
    }); 

    chrome.storage.local.set({'gameOver': false});
    chrome.storage.local.set({'winner': null});
});

socket.on('updateGameState', async(player_game_state) =>{
    var player_name = player_game_state.player;
    var new_game_state = player_game_state.game_state;
    chrome.storage.local.get('gameState', async function(gameData){
        gameData.gameState.players[player_name] = new_game_state.players[player_name];
        chrome.storage.local.set({'gameState': gameData.gameState});
    });
});

socket.on('winnerFound', async(player_game_state)=>{
    var player_name = player_game_state.player;
    var new_game_state = player_game_state.game_state;
    chrome.storage.local.get('gameState', async function(data){
        data.gameState.players[player_name] = new_game_state.players[player_name];
        chrome.storage.local.set({'gameState': data.gameState});
        chrome.storage.local.set({'winner': player_name});
        chrome.storage.local.set({'gameOver': true});
    });
    
    
})