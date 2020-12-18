// goes through the game state and updated the scores of all players in a game
_setPlayerScores = (this_player, game_state)=>{
  console.log(this_player, game_state)
  if (!game_state){
    return;
  }
  
  var player_div = document.getElementById('other-players');

  Object.keys(game_state.players)
  .filter((player)=> player!=this_player)
  .forEach((player)=>{
    console.log(`Found player ${player} with score ${game_state.players[player]["score"]}`)
    var player_el = document.getElementById(player);
    if (!player_el){
      player_el = document.createElement("p");
      player_el.setAttribute('id',player)
      player_el.innerHTML = `${player}: ${game_state.players[player]["score"]}`;
      player_div.appendChild(player_el);
    } else {
      player_el.innerHTML = `${player}: ${game_state.players[player]["score"]}`;
    }
  });
}

// sets the winner and changes status after a game is over
_postGameMetrics = (winner) => {
  document.getElementById('status').innerHTML = "Status: Post game";
  document.getElementById('winner').innerHTML = `Winner: <strong>${winner}</strong>`   
}

// resets the state of the game
_resetGameState = () =>{
  chrome.storage.local.get('gameState', function(gameData) {
    chrome.storage.local.get('ownerName', function(playerData) {
      var player = playerData.ownerName;
      console.log(gameData);
      document.getElementById('adsFound').innerHTML = gameData.gameState? gameData.gameState.players[player]["score"]: 0;
      document.getElementById('status').innerHTML = gameData.gameState?"Status: In game":"Status: Not in game";
      _setPlayerScores(player, gameData.gameState);
    });
  });
}

// searches for the user's user name and disabled the form if it exists
chrome.storage.local.get('ownerName', function(data) {
  if (data.ownerName){
    document.getElementById('usernameInput').setAttribute('hidden', true);
    document.getElementById('addName').setAttribute('hidden', true);
    document.getElementById('changeName').removeAttribute('hidden');
  }
});

// adds an event listener to handle form submition
document.forms['usernameForm'].addEventListener("submit", (event)=>{
  event.preventDefault();
  document.getElementById('usernameInput').setAttribute('hidden', true);
  document.getElementById('addName').setAttribute('hidden', true);
  document.getElementById('changeName').removeAttribute('hidden');

  
  var user_name = document.getElementById('usernameInput').value;
  chrome.storage.local.set({'ownerName': user_name});
});

// adds an event listener to the change name button to enable form
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

// get user authorisation to display the appropriate message
chrome.storage.local.get('auth', function(data) {
  document.getElementsByClassName('auth')[0].innerHTML = data.auth?"You are logged in":"You are not logged in";
});

// get the game state from storage to display relevant feedback
chrome.storage.local.get('gameState', function(gameData) {
  chrome.storage.local.get('ownerName', function(playerData) {
    var player = playerData.ownerName;
    document.getElementById('adsFound').innerHTML = gameData.gameState? gameData.gameState.players[player]["score"]: 0;
    document.getElementById('status').innerHTML = gameData.gameState?"Status: In game":"Status: Not in game";
    _setPlayerScores(player, gameData.gameState);
  });
});

// check if a game was played and was finished and set winner
chrome.storage.local.get('gameOver', function(gameOverData) {
  if (gameOverData.gameOver){
    chrome.storage.local.get('winner', function(winnerData){
      _postGameMetrics(winnerData.winner);
    });
  }
});

// Find the active tab and set the number of page ad trackers
chrome.tabs.query({active: true, windowType:"normal"}, function(tab) {
  var tab_id = tab[0].id.toString();
  chrome.storage.local.get([tab_id], function(data) {
    document.getElementById('ads').innerHTML = `(${data[tab_id].url}): ${data[tab_id].trackers}`;
  });
});

// listen to tab switches to update feedback accordingly
chrome.tabs.onActivated.addListener(function(activeInfo) {
  var tab_id = activeInfo.tabId.toString();
  chrome.storage.local.get([tab_id], function(data) {
    document.getElementById('ads').innerHTML = `(${data[tab_id].url}): ${data[tab_id].trackers}`;
  });
});

// Every time a value changes in our storage we listen to it
// We update the html accordingly
// This enables real-time updating of player scores and other feedback
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
      }else if (key=="gameOver"){
        if (storageChange.newValue){
          chrome.storage.local.get('winner', function(winnerData){
            _postGameMetrics(winnerData.winner);
          });
        } else {
          _resetGameState();
        }     
      }
      else if (key=="gameState" && storageChange.newValue) {
        document.getElementById('winner').innerHTML = "";
        chrome.storage.local.get('ownerName', function(data) {
          var player = data.ownerName;
          document.getElementById('adsFound').innerHTML = storageChange.newValue.players[player]["score"];
          document.getElementById('status').innerHTML = "Status: In game";
          _setPlayerScores(player, storageChange.newValue);
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

