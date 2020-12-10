var socket = io.connect('http://localhost:5000');

socket.on('connect', ()=>{
    console.log('Connected to server')
});

socket.on('loggedIn', async (payload)=>{
    chrome.storage.sync.get('auth', function(data) {
        chrome.storage.sync.set({'auth': true}, function() {
            console.log("User logged in web application");
        });  
    }); 
});

socket.on('notloggedIn', async (payload)=>{
    chrome.storage.sync.get('auth', function(data) {
        chrome.storage.sync.set({'auth': false}, function() {
            console.log("User not logged in web application");
        });  
    }); 
});