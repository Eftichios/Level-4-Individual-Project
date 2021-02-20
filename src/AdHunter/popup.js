// goes through the game state and updated the scores of all players in a game
_setPlayerScores = (this_player, game_state)=>{
  if (!game_state){
    return;
  }
  
  var player_div = document.getElementById('other-players');

  Object.keys(game_state.players)
  .filter((player)=> player!=this_player)
  .forEach((player)=>{
    var player_el = document.getElementById(player);
    if (!player_el){
      player_el = document.createElement("p");
      player_el.setAttribute('id',player)
      player_div.appendChild(player_el);
    } 
    if (game_state.game_mode==="Race"){
      player_el.innerHTML = `${player}: ${game_state.players[player]["score"]}`;
    }else {
      player_el.innerHTML = `${player}: ${game_state.players[player]["categories"].slice(-1)[0]===undefined?"None":game_state.players[player]["categories"].slice(-1)[0]}`;
    }
  });
}

// sets the winner and changes status after a game is over
_postGameMetrics = (winner) => {
  document.getElementById('status').innerHTML = "Status: Post game";
  document.getElementById('winner').innerHTML = `Winner: <strong>${winner}</strong>`   
  document.getElementById('other-players').innerHTML = "";
  document.getElementById('summary').removeAttribute('hidden');
  document.getElementById('race-stats').setAttribute('hidden', true);
  document.getElementById('category-stats').setAttribute('hidden', true);

}

// resets the state of the game
_resetGameState = () =>{
  document.getElementById('summary').setAttribute('hidden', true);
  chrome.storage.local.get('gameState', function(gameData) {
    chrome.storage.local.get('ownerName', function(playerData) {
      var player = playerData.ownerName;
      if (gameData.gameState){   
        switch (gameData.gameState.game_mode){
          case "Race":
            document.getElementById('adsFound').innerHTML = gameData.gameState.players[player]["score"];
            _setPlayerScores(player, gameData.gameState);
            break;
          case "Category":
            document.getElementById('category').innerHTML = gameData.gameState.condition;
            break;
        }
      }else{
        document.getElementById('status').innerHTML = "Status: Not in game";
        document.getElementById('adsFound').innerHTML = 0;
        document.getElementById('category').innerHTML = "None";
      }
    });
  });
}

// searches for the user's user name and disabled the form if it exists
chrome.storage.local.get('ownerName', function(data) {
  if (data.ownerName){
    document.getElementById('user').innerHTML = `Hello ${data.ownerName}!`
    document.getElementById('usernameInput').setAttribute('hidden', true);
    document.getElementById('addName').setAttribute('hidden', true);
    document.getElementById('changeName').removeAttribute('hidden');
  } else {
    document.getElementById('user').innerHTML = `Hello!`
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


// get the game state from storage to display relevant feedback
chrome.storage.local.get('gameState', function(gameData) {
  chrome.storage.local.get('ownerName', function(playerData) {
    var player = playerData.ownerName;
    if (gameData.gameState){
      _setPlayerScores(player, gameData.gameState);
      document.getElementById('status').innerHTML = `Status: In game (${gameData.gameState.game_mode})`;
      document.getElementById('changeName').setAttribute('disabled', true);
      switch(gameData.gameState.game_mode){
        case "Race":
          document.getElementById('adsFound').innerHTML = gameData.gameState.players[player]["score"];    
          document.getElementById('race-stats').removeAttribute('hidden');
          document.getElementById('category-stats').setAttribute('hidden', true);
          break;
        case "Category":
          document.getElementById('category').innerHTML = gameData.gameState.condition; 
          document.getElementById('race-stats').setAttribute('hidden', true);
          document.getElementById('category-stats').removeAttribute('hidden');    
          break;
      }  
    }else{
      document.getElementById('status').innerHTML = "Status: Not in game";
      document.getElementById('changeName').removeAttribute('disabled');
    }});
});

//get latest unique tracker found
chrome.storage.local.get("latestTracker", function(trackerData){
    document.getElementById('latestTracker').innerHTML = trackerData.latestTracker? trackerData.latestTracker:"None"
})

chrome.storage.local.get("adCount", function(adCountData){
  document.getElementById('adCount').innerHTML = `Categorised: ${adCountData.adCount["categorised"]}, Non-categorised: ${adCountData.adCount["non-categorised"]}`;
})

chrome.storage.local.get("latestCategory", function(categoryData){
  console.log(categoryData)
  document.getElementById('latestCategory').innerHTML = categoryData.latestCategory? categoryData.latestCategory.categories.join(" | "):"None"
})

// check if a game was played and was finished and set winner
// in the case where winner is null, that means the player has left the game
chrome.storage.local.get('postGame', function(gameOverData) {
  if (gameOverData.postGame){
    chrome.storage.local.get('winner', function(winnerData){
      if (winnerData.winner){
        _postGameMetrics(winnerData.winner);
      }
    });
  }else{
    _resetGameState();
  }
});

// Find the active tab and set the number of page ad trackers
chrome.tabs.query({active: true, windowType:"normal"}, function(tab) {
  var tab_id = tab[0].id;
  chrome.storage.local.get('tab_id_ads', function(page_data) {
    document.getElementById('ads').innerHTML = `(${page_data.tab_id_ads[tab_id].url}): ${page_data.tab_id_ads[tab_id].trackers}`;
  });
});

// listen to tab switches to update feedback accordingly
chrome.tabs.onActivated.addListener(function(activeInfo) {
  var tab_id = activeInfo.tabId;
  chrome.storage.local.get('tab_id_ads', function(page_data) {
    document.getElementById('ads').innerHTML = `(${page_data.tab_id_ads[tab_id].url}): ${page_data.tab_id_ads[tab_id].trackers}`;
  });
});

chrome.storage.local.get('error', function(err_data){
  if (err_data.error){
    document.getElementById('status').innerHTML = "Something went wrong..."
  }
})

// Every time a value changes in our storage we listen to it
// We update the html accordingly
// This enables real-time updating of player scores and other feedback
chrome.storage.onChanged.addListener(function(changes, namespace) {
  chrome.tabs.query({active: true, windowType:"normal"}, function(tab) {
    var tab_id = tab[0].id;
    for (var key in changes) {
      var storageChange = changes[key];
      if (key=="totalAds"){
        document.getElementById('totalAds').innerHTML = storageChange.newValue;
      }else if (key=='tab_id_ads'){
        document.getElementById('ads').innerHTML = `(${storageChange.newValue[tab_id].url}): ${storageChange.newValue[tab_id].trackers}`;
      }else if (key=="latestTracker"){
        document.getElementById('latestTracker').innerHTML = storageChange.newValue? storageChange.newValue:"None";
      }else if (key=="latestCategory"){
        document.getElementById('latestCategory').innerHTML = storageChange.newValue? storageChange.newValue.categories.join(" | "):"None";
      }else if (key=="adCount"){
        document.getElementById('adCount').innerHTML = `Categorised: ${storageChange.newValue["categorised"]}, Non-categorised: ${storageChange.newValue["non-categorised"]}`;
      }else if (key=="ownerName"){
        document.getElementById('user').innerHTML = `Hello ${storageChange.newValue}!`;
      }else if (key=="error" && storageChange.newValue){
        document.getElementById('status').innerHTML = "Something went wrong...";
      }else if (key=="postGame"){
        if (storageChange.newValue){
          chrome.storage.local.get('winner', function(winnerData){
            _postGameMetrics(winnerData.winner);
          });
        } else {
          _resetGameState();
        }     
      }
      else if (key=="gameState") {
        
        chrome.storage.local.get('ownerName', function(data) {
          var player = data.ownerName;
          if (storageChange.newValue){
            document.getElementById('winner').innerHTML = "";
            document.getElementById('status').innerHTML = `Status: In game (${storageChange.newValue.game_mode})`;
            document.getElementById('changeName').setAttribute('disabled', true);
          
          
          switch(storageChange.newValue.game_mode){      
            case "Race":
              document.getElementById('adsFound').innerHTML = storageChange.newValue.players[player]["score"];
              document.getElementById('race-stats').removeAttribute('hidden');
              document.getElementById('category-stats').setAttribute('hidden', true);
              _setPlayerScores(player, storageChange.newValue);
              break;
            case "category":
              document.getElementById('category').innerHTML = storageChange.newValue.condition;
              document.getElementById('race-stats').setAttribute('hidden', true);
              document.getElementById('category-stats').removeAttribute('hidden');   
              break;
            }
          } else {
            document.getElementById('changeName').removeAttribute('disabled');
          }
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

