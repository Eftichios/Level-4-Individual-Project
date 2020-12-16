var socket = io.connect('http://localhost:5000');

socket.on('connect', ()=>{
    console.log('Connected to server')
});

socket.on('identifyExtension', async (data)=>{
    chrome.storage.local.get('ownerName', async function(data){

        var user_id = await getUserIdFromName(data.ownerName);
        socket.emit("extensionResponse", {'foundUser': user_id?user_id:false, 'user_id':user_id});
    });
});

socket.on('gameStart', async(game_state)=>{
    chrome.storage.local.set({'gameOn': true}, function() {
        console.log("User has started the game");
    });  
    chrome.storage.local.set({'gameState': game_state}, function() {
        console.log("Initialise game state", game_state);
    }); 
});

socket.on('gameStop', async(payload)=>{
    chrome.storage.local.set({'gameOn': false}, function() {
        console.log("User has quit the game");
    });  

    chrome.storage.local.remove('gameState', function() {
        console.log("Destroyed game state");
    });

    chrome.storage.local.remove('player');
})