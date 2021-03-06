if (ad_urls === undefined){
    var ad_urls = new Set()
}
if (cat_winner === undefined){
    var cat_winner = null
}

extract_img_src = async (link_el) => {
    var img_child = link_el.getElementsByTagName("img");
    if (img_child.length > 0){
        return img_child[0].src
    }else{
        return null
    }
}

extract_links = async ()=>{
    // check if game is over
    chrome.storage.local.get("winner", (winnerData)=>{
        if (winnerData.winner){
            cat_winner = winnerData.winner
        }else{
            cat_winner = null
        }
    });

    if (cat_winner){
        return;
    }
    
    var all_links = Array.prototype.slice.call(document.getElementsByTagName("a"));
    for (i in all_links){
        var categories = [];
        if (all_links[i].href.includes("adurl")){
            
            var redirect_url = find_domain(all_links[i].href)
            if (!redirect_url){
                continue
            }
            if (!ad_urls.has(redirect_url)){
                ad_urls.add(redirect_url);
                // identify advert image
                var img_src = await extract_img_src(all_links[i]);
                if (!img_src){
                    console.log("Could not extract image src");
                    img_src = null;
                }

                var parseRes = [];
                try{
                    var response = await fetch("http://localhost:5000/api/category", {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({"ad_url":redirect_url})
                    });

                    parseRes = await response.json();
                    console.log(parseRes);
                } catch (err){
                    parseRes = ["No Category"]
                } finally {
                    var temp_domain = extractDomain(location.href);
                    if (parseRes[0] !== "No Category"){
                        chrome.storage.local.set({'latestCategory': {"categories":parseRes, "url":temp_domain || "Unknown", "img_src": img_src}});
                    }
                    
                    chrome.storage.local.get("adCount", async (adCountData)=>{
                        parseRes[0] !== "No Category"?adCountData.adCount["categorised"] += 1: adCountData.adCount["non-categorised"] += 1
                        chrome.storage.local.set({"adCount": adCountData.adCount});
                    })
                    chrome.storage.local.get("gameState",async (gameData)=>{
                        chrome.storage.local.get("ownerName", async (ownerData)=>{
                            if (gameData.gameState){
                                gameData.gameState.players[ownerData.ownerName]["categories"] = gameData.gameState.players[ownerData.ownerName]["categories"].concat(parseRes)
                                chrome.storage.local.set({"gameState": gameData.gameState});
                                if (parseRes.includes(gameData.gameState.condition)){
                                    chrome.storage.local.set({'handleCategorySockets': {"type": "winner", "data": {
                                        'player':ownerData.ownerName,'game_state':gameData.gameState, 'img_src':img_src}}})
                                    chrome.storage.local.set({'winner': ownerData.ownerName});
                                    chrome.storage.local.set({'gameMode': null});
                                    chrome.storage.local.set({'postGame': gameData.gameState});
                                    chrome.storage.local.set({'gameState': null});
                                    chrome.storage.local.set({'adCount': {"categorised":0, "non-categorised":0}});
                                } else {
                                    chrome.storage.local.set({'handleCategorySockets': {"type": "update", "data": {'player':ownerData.ownerName,'game_state':gameData.gameState}, 
                                    'log_stats': {url: redirect_url, img: img_src, categories: parseRes}}})
                                }
                            }
                        });
                    });
                }
            }
        }
    }
} 

find_domain = (url) =>{
    var result = url.match(/.*adurl=(.*)/)
    return result?result[1]:null;
}

extractDomain = (url)=>{
    if (!url){
      return null
    }
    var match = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
    var domain = match && match[1];
  
    return domain
}

var categories = extract_links();

