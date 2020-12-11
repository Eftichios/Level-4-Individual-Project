var socket = io.connect('http://localhost:5000');

socket.on('connect', ()=>{
    console.log('Connected to server')
});

socket.on('loggedIn', async (payload)=>{
    chrome.storage.sync.set({'auth': true}, function() {
        console.log("User logged in web application");  
    }); 
});

socket.on('notloggedIn', async (payload)=>{
    chrome.storage.sync.set({'auth': false}, function() {
        console.log("User not logged in web application");
    });  
});

socket.on('gameStart', async(payload)=>{
    chrome.storage.sync.set({'gameOn': true}, function() {
        console.log("User has started the game");
    });  
    chrome.storage.sync.set({'gameState': payload.game_state}, function() {
        console.log("Initialise game state", payload.game_state);
    }); 

    chrome.storage.sync.set({'player': payload.player}, function() {
        console.log("Player:", payload.player);
    }); 
});

socket.on('gameStop', async(payload)=>{
    chrome.storage.sync.set({'gameOn': false}, function() {
        console.log("User has quit the game");
    });  

    chrome.storage.sync.remove('gameState', function() {
        console.log("Destroyed game state");
    });

    chrome.storage.sync.remove('player');
})