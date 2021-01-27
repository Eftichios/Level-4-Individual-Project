// Initialise relevant player metrics when extension is installed
chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.local.set({'totalAds': 0}, function(){
      console.log("Initialise total ads number.")
    });
    chrome.storage.local.set({'gameState': null});
    chrome.storage.local.set({'gameMode': null});
    chrome.storage.local.set({'ownerName': null});
    chrome.storage.local.set({'ownerId': null});
    chrome.storage.local.set({'page_history': {}});
    chrome.storage.local.set({'latestTracker': null});
    chrome.storage.local.set({'latestCategory': null});
    chrome.storage.local.set({"postGame": null});
  });

  // Enables the extension for all pages given in the pageUrl option
  // hostConatins: "." matches all urls, i.e it works on all pages
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {urlContains: "/"},
      })
      ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });

  // For each already open tab in chrome, initialise a counter for ad trackers
  chrome.tabs.query({}, function(tab) {
    tab.forEach((t) => {
      var id = t.id.toString();
      var domain = extractDomain(t.url);
      if (!domain){
        domain = "other";
      }
      chrome.storage.local.set({[id]: {'url':domain, 'trackers':0}}, function() {
      console.log("Initialised total ads for tab with id",id, t);
    });
    });
  });
  
  // When a new tab is created, initialise a counter for ad trackers
  chrome.tabs.onCreated.addListener(function (tab) {
    var id = tab.id.toString();
    var domain = extractDomain(tab.url) || extractDomain(tab.pendingUrl);
    if (!domain){
      domain = "other";
    }
    chrome.storage.local.set({[id]: {'url':domain, 'trackers':0}}, function() {
      console.log("Initialised total ads for tab with id",id);
    });
  });


  // When a tab is destroyed, remove the counter from storage
  chrome.tabs.onRemoved.addListener(function (tab_id){
    var id = tab_id.toString()
    chrome.storage.local.remove([id], function() {
      console.log("Destroyed total ads for tab with id ",id);
    });
  })

  // Listen to url changes in order to update url trackers
  chrome.tabs.onUpdated.addListener(function (tab_id){
    var id = tab_id.toString();
    chrome.tabs.get(tab_id, function(tab_details){
      try{
        var domain = extractDomain(tab_details.url);
        if (!domain){
          domain = "other";
        }
        chrome.storage.local.get([id], function(data) {
          if (data[id].url !== domain){
            chrome.storage.local.set({[id]: {'url':domain, 'trackers':0}}, function() {
              console.log("Updated tab url",id);
            });
          }
        });
      } catch (err){
        console.log(err.message);
        chrome.storage.local.set({[id]: {'url':domain?domain:"other", 'trackers':0}}, function() {
          console.log("Updated tab url",id);
        });
      }
       
    });   
  });

  // listen to content script messages
  // every 2 seconds runs the content script inside all frames
  chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    if(request.reinject) {
      chrome.tabs.executeScript(sender.tab.id,{
        file: "category_mode.js", 
        allFrames: true },
      function(results){
        chrome.tabs.sendMessage(sender.tab.id, sender.tab.id);
        console.log("success in injecting script into iframes of page", results);
      });
    }
  });

  // handle category mode win
  chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (var key in changes) {
      var storageChange = changes[key];        
      if (key=="handleCategorySockets"){
        if (storageChange.newValue){
          switch(storageChange.newValue.type){
            case "update":
              socket.emit('sendUpdateToAllClients', {"player": storageChange.newValue.data.player, "game_state": storageChange.newValue.data.game_state})
              break;
            case "winner":
              socket.emit('playerWon', {"player": storageChange.newValue.data.player, "game_state": storageChange.newValue.data.game_state})
              break;
          }
        }
      } else if (key=="winner"){
        if (storageChange.newValue){
          chrome.browserAction.setBadgeBackgroundColor({ color: "#007bff" });
          chrome.browserAction.setBadgeText({text: '(!)'});
        } else {
          chrome.browserAction.setBadgeText({text: ''});
        }
        
      } else if (key=="error"){
        chrome.storage.local.get("ownerName", function(owner_data){
          socket.emit('extensionError', {player: owner_data.ownerName, error: storageChange.newValue});

        })
      }
    }
  }); 

