_setPlayerScores = (this_player, game_state)=>{
  if (!game_state){
    return;
  }
  
  var player_div = document.getElementById('other-players');

  Object.keys(game_state.players)
  .filter((player)=> player!=this_player)
  .forEach((player)=>{
    console.log(`Found player ${player} with score ${game_state.players[player]}`)
    var player_el = document.createElement("p");
    player_el.innerHTML = `${player}: ${game_state.players[player]}`;
    player_div.appendChild(player_el);
  });
}



chrome.storage.local.get('ownerName', function(data) {
  if (data.ownerName){
    document.getElementById('usernameInput').setAttribute('hidden', true);
    document.getElementById('addName').setAttribute('hidden', true);
    document.getElementById('changeName').removeAttribute('hidden');
  }
});


document.forms['usernameForm'].addEventListener("submit", (event)=>{
  event.preventDefault();
  document.getElementById('usernameInput').setAttribute('hidden', true);
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
  chrome.storage.local.get('ownerName', function(playerData) {
    var player = playerData.ownerName;
    document.getElementById('adsFound').innerHTML = gameData.gameState? gameData.gameState.players[player]: 0;
    _setPlayerScores(player, gameData.gameState);
  });
});

// Find the active tab and set the number of page ad trackers
chrome.tabs.query({active: true, windowType:"normal"}, function(tab) {
  var tab_id = tab[0].id.toString();
  chrome.storage.local.get([tab_id], function(data) {
    document.getElementById('ads').innerHTML = `(${data[tab_id].url}): ${data[tab_id].trackers}`;
  });
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
  var tab_id = activeInfo.tabId.toString();
  chrome.storage.local.get([tab_id], function(data) {
    document.getElementById('ads').innerHTML = `(${data[tab_id].url}): ${data[tab_id].trackers}`;
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
        document.getElementById('ads').innerHTML = `(${storageChange.newValue.url}): ${storageChange.newValue.trackers}`;
      }else if (key=="auth") {
        document.getElementsByClassName('auth')[0].innerHTML = storageChange.newValue==true?"You are logged in":"You are not logged in";
      }else if (key=="gameOn") {
        document.getElementsByClassName('gameOn')[0].innerHTML = storageChange.newValue==true?"Status: In game":"Status: Not in game";
        if (storageChange.newValue==false) {
          chrome.storage.local.set({"gameState": null});
          chrome.storage.local.set({'player': null});
          document.getElementById('adsFound').innerHTML = 0;
        }
      }else if (key=="gameState" && storageChange.newValue) {
        chrome.storage.local.get('ownerName', function(data) {
          var player = data.ownerName;
          document.getElementById('adsFound').innerHTML = storageChange.newValue.players[player];
          _setPlayerScores(player, storageChange.newValue.gameState);
        });
      } else {
        document.getElementById('adsFound').innerHTML = 0;
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

