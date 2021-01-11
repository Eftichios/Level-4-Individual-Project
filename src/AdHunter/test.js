if (ad_urls === undefined){
    var ad_urls = new Set()
}


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    extract_links(message);
});

extract_links = (tab_id)=>{
    var all_links = Array.prototype.slice.call(document.getElementsByTagName("a"));
    for (i in all_links){
        if (all_links[i].href.includes("adurl")){
            var redirect_url = find_domain(all_links[i].href)
            if (!ad_urls.has(redirect_url)){
                ad_urls.add(redirect_url);
                console.log(ad_urls);
                // make request to server
            }
        }
    }
} 

find_domain = (url) =>{
    var result = url.match(/.*adurl=(.*)/)
    return result[1];
}

