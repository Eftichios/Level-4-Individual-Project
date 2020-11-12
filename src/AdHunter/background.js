chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({color: '#3aa757'}, function() {
      console.log("The color is green.");
    });
    chrome.storage.sync.set({'totalAds': 0}, function(){
      console.log("Initialise total ads number.")
    })
  });

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostContains: "."},
      })
      ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });

  chrome.tabs.query({}, function(tab) {
    console.log(tab);
    tab.forEach((t) => {
      var id = t.id.toString();
      chrome.storage.sync.set({[id]: 0}, function() {
      console.log("Initialised total ads for tab with id",id);
    });
    });
  });
  
  chrome.tabs.onCreated.addListener(function (tab) {
    console.log(tab, " CREATED");
    var id = tab.id.toString();
    chrome.storage.sync.set({[id]: 0}, function() {
      console.log("Initialised total ads for tab with id",id);
    });
  });

  chrome.tabs.onRemoved.addListener(function (tab_id){
    console.log(tab_id, " DESTROYED")
    var id = tab_id.toString()
    chrome.storage.sync.remove([id], function() {
      console.log("Destroyed total ads for tab with id ",id);
    });
  })