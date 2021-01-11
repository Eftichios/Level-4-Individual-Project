// send a message to the background script every two seconds
// only if Category game mode is active
chrome.storage.local.get("gameMode", function(data){
    if (data.gameMode==="Category"){
        var interval_id = setInterval(function() { 
            chrome.runtime.sendMessage({reinject: true});
        }, 2000);

        setTimeout(function(){
            clearInterval(interval_id)
            console.log("CLEARED INTERVAL");
        }, 40000)
    }
});
