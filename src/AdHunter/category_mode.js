if (ad_urls === undefined){
    var ad_urls = new Set()
}

extract_links = async ()=>{
    var all_links = Array.prototype.slice.call(document.getElementsByTagName("a"));
    for (i in all_links){
        var categories = [];
        if (all_links[i].href.includes("adurl")){
            
            var redirect_url = find_domain(all_links[i].href)
            if (!ad_urls.has(redirect_url)){
                ad_urls.add(redirect_url);
                console.log(ad_urls);
                try{
                    var response = await fetch("http://localhost:5000/api/category", {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({"ad_url":redirect_url})
                    });

                    var parseRes = await response.json();
                    chrome.storage.local.set({'latestCategory': parseRes});
                } catch (err){
                    chrome.storage.local.set({'latestCategory': ["No Category"]});
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

