if (ad_urls === undefined){
    var ad_urls = new Set()
}
if (cat_winner === undefined){
    var cat_winner = null
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
            if (!ad_urls.has(redirect_url)){
                ad_urls.add(redirect_url);
                console.log(ad_urls);
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
                    chrome.storage.local.set({'latestCategory': parseRes});
                    chrome.storage.local.get("gameState",async (gameData)=>{
                        chrome.storage.local.get("ownerName", async (ownerData)=>{
                            if (gameData.gameState){
                                gameData.gameState.players[ownerData.ownerName]["categories"] = gameData.gameState.players[ownerData.ownerName]["categories"].concat(parseRes)
                                if (parseRes.includes(gameData.gameState.condition)){
                                    chrome.storage.local.set({'handleCategorySockets': {"type": "winner", "data": {'player':ownerData.ownerName,'game_state':gameData.gameState}}})
                                    chrome.storage.local.set({'winner': ownerData.ownerName});
                                    chrome.storage.local.set({'gameMode': null});
                                    chrome.storage.local.set({'postGame': gameData.gameState});
                                    chrome.storage.local.set({'gameState': null});
                                } else {
                                    chrome.storage.local.set({'handleCategorySockets': {"type": "update", "data": {'player':ownerData.ownerName,'game_state':gameData.gameState}}})
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
    return result[1];
}

var categories = extract_links();

