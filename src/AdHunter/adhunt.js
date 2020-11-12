chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        //console.log("Block: ", details)
                
        chrome.storage.sync.get('totalAds', function(data) {
            chrome.storage.sync.set({'totalAds': data.totalAds + 1}, function() {
                console.log("Total ads: ", data.totalAds + 1);
            });  
        }); 

        chrome.tabs.query({active: true, windowType:"normal"}, function(tab) {
            var tab_id = tab[0].id.toString();
            chrome.storage.sync.get([tab_id], function(data) {
                chrome.storage.sync.set({[tab_id]: data[tab_id] + 1}, function() {
                    console.log("Page ads: ", data[tab_id] + 1);
                });  
            });
          });
        
        
        fetch('http://localhost:5000/extension', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(details),
            })
            .then(response => {
                //console.log(response);
 
            })
        return {cancel: true}
    },
    {urls: blocked_domains},
)
