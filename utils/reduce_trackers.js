const blocked_domains = require("../sequelize/data/blocked.js");
const fs = require("fs");
var path = require('path')
var stringSimilarity = require("string-similarity");
const trackers = require("./trackerData")
const trackerInfo = require("../sequelize/data/trackerDataInfo")

const countries = ["US","GB", "CA", "DE", "AU",,"CH",,"FR",,"NL","NO",]

function createTrackerJson(){
    var trackers = {};
    var origins = {};
    var unknown = [];
    var count_found = 0;
    var count_unknown = 0;
    Object.entries(blocked_domains).forEach(([key,value])=>{
        trackers[key] = false;
        var found = false;
        for (var country_index in countries){
            var country = countries[country_index]
            var files = fs.readdirSync("C:/Users/eftic/Desktop/Eftychios/University/Year 4/Dissertation/Individual Project/src/server/Domains/" + country + "/");
            var parsed_files = files.map(file_name=>file_name.indexOf(".")!==-1?file_name.substring(0, file_name.indexOf(".")):file_name );
            if (key.indexOf(".")!==-1){
                key = key.substring(0, key.indexOf("."))
            }

            var rankings = stringSimilarity.findBestMatch(key, parsed_files);
            if (rankings["bestMatch"]["rating"]>=0.8){
                console.log(rankings["bestMatch"], key, files[rankings["bestMatchIndex"]]);
                origins[key] = {"file": files[rankings["bestMatchIndex"]], "country":country};
                found = true;
                count_found+=1
                break;
            }
        } 
        
        // console.log(`Tracker ${key} not found.`)
        if (!found){
            unknown.push(key)
            count_unknown+=1;
        }
        
        
    })
    console.log(origins);
    var accessLogStream = fs.createWriteStream(path.join(__dirname,"trackerData.js"), { flags: 'a' });
    accessLogStream.write("var tracker_data = {")
    Object.entries(origins).forEach(([key,value])=>{
        console.log(key,value);
        accessLogStream.write(`"${key}": {file: "${value["file"]}", country: "${value["country"]}"},`)
    });
    accessLogStream.write("}")
    // console.log()
    return trackers
}

var accessLogStream = fs.createWriteStream(path.join(__dirname,"trackerDataInfoV1.js"), { flags: 'a' });
    accessLogStream.write("var tracker_data = {")
Object.entries(trackers).forEach(([key,value])=>{
    // console.log(key,value);
    var further_info = require(`../Domains/${value["country"]}/${value["file"]}`)
    var name = further_info["owner"]["name"]?further_info["owner"]["name"]: "Unknown";
    var country = value["country"];
    var domain = further_info["domain"]?further_info["domain"]: "Unknown";
    // console.log(key, name, country, domain);
    accessLogStream.write(`"${key}": {name: "${name}", country: "${country}", domain: "${domain}"},`)
});
accessLogStream.write("}")

console.log(Object.entries(blocked_domains).length, Object.entries(trackerInfo).length)

// if (trackers === undefined){
//     var trackers = createTrackerJson();
// }

// module.exports = trackers