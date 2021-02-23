// Initialise relevant player metrics when extension is installed
chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.local.set({'totalAds': 0});
    chrome.storage.local.set({'tab_id_ads': 0});
    chrome.storage.local.set({'gameState': null});
    chrome.storage.local.set({'gameMode': null});
    chrome.storage.local.set({'ownerName': null});
    chrome.storage.local.set({'ownerId': null});
    chrome.storage.local.set({'page_history': {}});
    chrome.storage.local.set({'latestTracker': null});
    chrome.storage.local.set({'latestCategory': null});
    chrome.storage.local.set({"postGame": null});
    chrome.storage.local.set({'adCount': {"categorised":0, "non-categorised":0}});
    chrome.storage.local.set({'winCondition': null});

    // For each already open tab in chrome, initialise a counter for ad trackers
    chrome.tabs.query({}, function(tab) {
      var temp_ads = {}
      tab.forEach(async (t) => {
        var id = t.id
        var domain = extractDomain(t.url);
        if (!domain){
          domain = "other";
        }  
        temp_ads[id] = {'url': domain, 'trackers': 0};   
      });
      chrome.storage.local.set({'tab_id_ads': temp_ads}, ()=>{
        console.log(temp_ads);
      })
    });
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
  
  // When a new tab is created, initialise a counter for ad trackers
  chrome.tabs.onCreated.addListener(function (tab) {
    var id = tab.id
    var domain = extractDomain(tab.url) || extractDomain(tab.pendingUrl);
    if (!domain){
      domain = "other";
    }
    chrome.storage.local.get('tab_id_ads', (page_data)=>{
      var tab_ads = page_data.tab_id_ads;
      tab_ads[id] = {'url':domain, 'trackers':0}
      chrome.storage.local.set({'tab_id_ads': tab_ads}, function() {
        console.log("Initialised total ads for tab with id",id);
      });
    });
  });


  // When a tab is destroyed, remove the counter from storage
  chrome.tabs.onRemoved.addListener(function (tab_id){
    var id = tab_id
    chrome.storage.local.get('tab_id_ads', (page_data)=>{
      var tab_ads = page_data.tab_id_ads;
      delete tab_ads[id]
      chrome.storage.local.set({'tab_id_ads': tab_ads}, function() {
        console.log("Initialised total ads for tab with id",id);
      });
    });
  })

  // Listen to tab changes in order to update page url and trackers
  chrome.tabs.onUpdated.addListener(function (tab_id){
    var id = tab_id
    chrome.tabs.get(id, function(tab_details){
      if (chrome.runtime.lastError){
        return
      }
      var domain = extractDomain(tab_details.url);
      if (!domain){
        domain = "other";
      }
      chrome.storage.local.get('tab_id_ads', (page_data)=>{
        var tab_ads = page_data.tab_id_ads;
        if (tab_ads[id]){
          if (tab_ads[id].url !== domain){
            tab_ads[id] = {'url':domain, 'trackers':0}
          } else {
            tab_ads[id]['url'] = domain
          }
          chrome.storage.local.set({'tab_id_ads': tab_ads}, function() {
            console.log("Updated tab url",id);
          });
        }  
      });
    })
  });

  // listen to content script messages
  // every 0.5 seconds runs the content script inside all frames
  chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    if(request.reinject) {
      chrome.tabs.executeScript(sender.tab.id,{
        file: "category_mode.js", 
        allFrames: true },
      function(results){
        chrome.tabs.sendMessage(sender.tab.id, sender.tab.id);
        void chrome.runtime.lastError
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
              logger.log("game", `Advert identified`, storageChange.newValue.data.player, storageChange.newValue.log_stats.img, storageChange.newValue.log_stats.categories)
              socket.emit('sendUpdateToAllClients', {"player": storageChange.newValue.data.player, "game_state": storageChange.newValue.data.game_state})
              break;
            case "winner":
              storageChange.newValue.data.game_state["finished_at"] = new Date()
              socket.emit('playerWon', {"player": storageChange.newValue.data.player, "game_state": storageChange.newValue.data.game_state, "img_src": storageChange.newValue.data.img_src})
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
        if (storageChange.newValue){
          chrome.browserAction.setBadgeBackgroundColor({ color: "#dc3545" });
          chrome.browserAction.setBadgeText({text: 'x'});
          chrome.storage.local.get("ownerName", function(owner_data){
            socket.emit('extensionError', {player: owner_data.ownerName, error: storageChange.newValue});
  
          })
        } else {
          chrome.browserAction.setBadgeText({text: ''});
        }
      }else if (key=="gameState"){
        chrome.storage.local.get("winner", (winnerData)=>{
          if (storageChange.newValue && !winnerData.winner){
            chrome.browserAction.setBadgeBackgroundColor({ color: "#28a745" });
            chrome.browserAction.setBadgeText({text: ' '});
          } 
        })
        
      }else if (key=="userLeft" && storageChange.newValue){
        chrome.browserAction.setBadgeText({text: ''})
      }
    }
  }); 

