const blocked_domains = require("../sequelize/data/blocked.js")
const tracker_data = require("../sequelize/data/trackerDataInfo");

function createTrackerJson(){
    var trackers = {}
    Object.entries(blocked_domains).forEach(([key,value])=>{
        if (tracker_data.hasOwnProperty(key)){
            trackers[key] = {"found": false,"extra_info": true};
        }else {
            trackers[key] = {"found": false,"extra_info": false};
        }
        
    })
    return trackers
}

if (trackers === undefined){
    var trackers = createTrackerJson();
}

module.exports = trackers