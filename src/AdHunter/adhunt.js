chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        console.log("Block: ", details.url)
        return {cancel: true}
    },
    {urls: blocked_domains},
    ["blocking"]
)
