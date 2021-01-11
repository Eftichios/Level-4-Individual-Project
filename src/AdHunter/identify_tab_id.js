// send a message to the background script every two seconds

var interval_id = setInterval(function() { 
    chrome.runtime.sendMessage({reinject: true});
}, 2000);

setTimeout(function(){
    clearInterval(interval_id)
    console.log("CLEARED INTERVAL");
}, 40000)



