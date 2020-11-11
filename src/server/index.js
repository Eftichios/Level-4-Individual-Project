const express = require('express');
const cors = require('cors');
//const pool = require("./db");

app = express();

app.use(cors());
app.use(express.json())

const countries = ["AU","CA","CH","DE","FR","GB","NL","NO","US"];
var unique_hosts = [];


const codes = {
    AU: "Australia",
    CA: "Canada",
    CH: "Switzerland",
    DE: "Germany",
    FR: "France",
    GB: "Great Britain",
    NL: "Netherlands",
    NO: "Norway",
    US: "United States" 
}

app.get("/index", async(req, res)=>{
    res.send("Server says hi!");
})

app.post('/extension', function (req, res) {
    res.send('POST request to the extensions');
    var url = req.body.url;
    var hostname = (new URL(url)).hostname;

    if (hostname.startsWith("www.")) {
        hostname = hostname.substring(4, hostname.length)
    } else {
        hostname = hostname.match(/(\w+\.\w+$)/)[0];
    }
    

    //console.log(req.body);
    if (!unique_hosts.includes(hostname)){
        unique_hosts.push(hostname);
        var all_locations = [];
        var owner = "Unknown";
        for (var i=0; i < countries.length; i++) {  
            try {
                var domain = require("./Domains/" + countries[i] + "/" + hostname +".json");
                all_locations.push(codes[countries[i]])
                owner = domain.owner.name;
            } catch (err) {
                //console.log("NOT FOUND");
            }   
        }   
        var origin = all_locations.length>0? all_locations.toString() : "Unknown";
        console.log("Name: " + owner + " Country: " + origin + " Domain: " + hostname);
    }})

app.listen(5000, ()=>{
    console.log("Server has started");
});