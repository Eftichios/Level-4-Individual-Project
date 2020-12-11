// Initialise color and total ads number when extension is installed
chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.local.set({color: '#3aa757'}, function() {
      console.log("The color is green.");
    });
    chrome.storage.local.set({'totalAds': 0}, function(){
      console.log("Initialise total ads number.")
    });
    chrome.storage.local.set({'auth': null}, function(){
      console.log("Looking for user authentication...")
    });
    chrome.storage.local.set({'gameOn': false}, function(){
      console.log("Setting status...")
    });
    chrome.storage.local.set({'gameState': null})
    chrome.storage.local.set({'player': null})

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
      chrome.storage.local.set({[id]: 0}, function() {
      console.log("Initialised total ads for tab with id",id);
    });
    });
  });
  
  // When a new tab is created, initialise a counter for ad trackers
  chrome.tabs.onCreated.addListener(function (tab) {
    console.log(tab, " CREATED");
    var id = tab.id.toString();
    chrome.storage.local.set({[id]: 0}, function() {
      console.log("Initialised total ads for tab with id",id);
    });
  });


  // When a tab is destroyed, remove the counter from storage
  chrome.tabs.onRemoved.addListener(function (tab_id){
    console.log(tab_id, " DESTROYED")
    var id = tab_id.toString()
    chrome.storage.local.remove([id], function() {
      console.log("Destroyed total ads for tab with id ",id);
    });
  })