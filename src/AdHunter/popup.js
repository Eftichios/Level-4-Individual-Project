// get total ads from storage and display it in our popup
chrome.storage.sync.get('totalAds', function(data) {
  document.getElementById('totalAds').innerHTML = data.totalAds;
});

chrome.storage.sync.get('auth', function(data) {
  console.log(data.auth);
  document.getElementsByClassName('auth')[0].innerHTML = data.auth?"You are logged in":"You are not logged in";
});

// Find the active tab and set the number of page ad trackers
chrome.tabs.query({active: true, windowType:"normal"}, function(tab) {
  var tab_id = tab[0].id.toString();
  chrome.storage.sync.get([tab_id], function(data) {
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

