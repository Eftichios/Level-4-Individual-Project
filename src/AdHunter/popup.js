chrome.storage.local.get('ownerName', function(data) {
  if (data.ownerName){
    document.getElementById('usernameInput').setAttribute('hidden', true);
    document.getElementById('usernameLabel').setAttribute('hidden', true);
    document.getElementById('addName').setAttribute('hidden', true);
    document.getElementById('changeName').removeAttribute('hidden');
  }
});


document.forms['usernameForm'].addEventListener("submit", (event)=>{
  event.preventDefault();
  document.getElementById('usernameInput').setAttribute('hidden', true);
  document.getElementById('usernameLabel').setAttribute('hidden', true);
  document.getElementById('addName').setAttribute('hidden', true);
  document.getElementById('changeName').removeAttribute('hidden');

  
  var user_name = document.getElementById('usernameInput').value;
  chrome.storage.local.set({'ownerName': user_name});
});

document.getElementById('changeName').addEventListener("click", (event)=>{
  event.preventDefault();
  document.getElementById('usernameInput').removeAttribute('hidden');
  document.getElementById('addName').removeAttribute('hidden');
  document.getElementById('changeName').setAttribute('hidden', true);
});


// get total ads from storage and display it in our popup
chrome.storage.local.get('totalAds', function(data) {
  document.getElementById('totalAds').innerHTML = data.totalAds;
});

chrome.storage.local.get('auth', function(data) {
  document.getElementsByClassName('auth')[0].innerHTML = data.auth?"You are logged in":"You are not logged in";
});

chrome.storage.local.get('gameOn', function(data) {
  document.getElementsByClassName('gameOn')[0].innerHTML = data.gameOn?"Status: In game":"Status: Not in game";
});

chrome.storage.local.get('gameState', function(gameData) {
  chrome.storage.local.get('player', function(playerData) {
    var player = playerData.player;
    if (gameData.gameState){
      document.getElementById('adsFound').innerHTML = gameData.gameState.players[player];
    }
  });
});

// Find the active tab and set the number of page ad trackers
chrome.tabs.query({active: true, windowType:"normal"}, function(tab) {
  var tab_id = tab[0].id.toString();
  chrome.storage.local.get([tab_id], function(data) {
    document.getElementById('ads').innerHTML = data[tab_id];
  });
});

// Every time a value changes in our storage we listen to it
// We check if the values that have changed are any of the total ads or page ads
// We update the html accordingly
chrome.storage.onChanged.addListener(function(changes, namespace) {
  chrome.tabs.query({active: true, windowType:"normal"}, function(tab) {
    var tab_id = tab[0].id.toString();
    for (var key in changes) {
      var storageChange = changes[key];
      if (key=="totalAds"){
        document.getElementById('totalAds').innerHTML = storageChange.newValue;
      }else if (key==tab_id){
        document.getElementById('ads').innerHTML = storageChange.newValue;
      }else if (key=="auth") {
        document.getElementsByClassName('auth')[0].innerHTML = storageChange.newValue==true?"You are logged in":"You are not logged in";
      }else if (key=="gameOn") {
        document.getElementsByClassName('gameOn')[0].innerHTML = storageChange.newValue==true?"Status: In game":"Status: Not in game";
        if (storageChange.newValue==false) {
          chome.storage.local.set("gameState", null);
          chrome.storage.local.set({'player': null});
        }
      }else if (key=="gameState" && storageChange.newValue) {
        chrome.storage.local.get('player', function(data) {
          var player = data.player;
          document.getElementById('adsFound').innerHTML = storageChange.newValue.players[player];
        });
      }
      console.log('Storage key "%s" in namespace "%s" changed. ' +
                  'Old value was "%s", new value is "%s".',
                  key,
                  namespace,
                  storageChange.oldValue,
                  storageChange.newValue);
      
    }
  });
});

