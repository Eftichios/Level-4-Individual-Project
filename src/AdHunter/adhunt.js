chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        console.log("Block: ", details)
        fetch('http://localhost:5000/extension', {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(details),
            })
            .then(response => console.log(response))
        return {cancel: true}
    },
    {urls: blocked_domains},
    ["requestBody"]
)
