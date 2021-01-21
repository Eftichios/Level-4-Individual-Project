const blocked_domains = require("../sequelize/data/blocked.js")

function createTrackerJson(){
    var trackers = {}
    Object.entries(blocked_domains).forEach(([key,value])=>{
        trackers[key] = false;
    })
    return trackers
}

if (trackers === undefined){
    var trackers = createTrackerJson();
}

module.exports = trackers