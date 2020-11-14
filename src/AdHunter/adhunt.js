// Adds a listener function to all requests that match url from the blocked domains
chrome.webRequest.onCompleted.addListener(
    function(details) {

        // Add 1 to the total ad trackers number      
        chrome.storage.sync.get('totalAds', function(data) {
            chrome.storage.sync.set({'totalAds': data.totalAds + 1}, function() {
                console.log("Total ads: ", data.totalAds + 1);
            });  
        }); 
        
        // Add 1 to the page ad trackers number
        chrome.tabs.query({active: true, windowType:"normal"}, function(tab) {
            var tab_id = tab[0].id.toString();
            chrome.storage.sync.get([tab_id], function(data) {
                chrome.storage.sync.set({[tab_id]: data[tab_id] + 1}, function() {
                    console.log("Page ads: ", data[tab_id] + 1);
                });  
            });
          });
        
        // make a POST request to the server
        // with the details of the request
        fetch('http://localhost:5000/extension', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(details),
            })
            .then(response => {
                console.log(response);
 
            })
        return {cancel: true}
    },
    {urls: blocked_domains},
)
