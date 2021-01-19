if (ad_urls === undefined){
    var ad_urls = new Set()
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    extract_links(message);
});

extract_links = async (tab_id)=>{
    var all_links = Array.prototype.slice.call(document.getElementsByTagName("a"));
    for (i in all_links){
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
                console.log(parseRes);
                } catch (err){
                    //unkown category
                }
            }
        }
    }
} 

find_domain = (url) =>{
    var result = url.match(/.*adurl=(.*)/)
    return result[1];
}

