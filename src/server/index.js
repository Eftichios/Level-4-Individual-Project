const express = require('express');
const cors = require('cors');
const pool = require("./db");

// create express app
app = express();

// use cors and allow for json responses
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

//ROUTES//

//register and login routes

app.use("/auth", require("./routes/jwtAuth"));

//dashboard route
app.use("/dashboard", require("./routes/dashboard"));

//other routes

app.get("/index", async(req, res)=>{
    res.send("Server says hi!");
})

// Receives details of a network request
// Finds the name and location of the organisation that owns the server
app.post('/extension', function (req, res) {
    res.send('POST request to the extensions');
    var url = req.body.url;
    var hostname = (new URL(url)).hostname;

    // format the hostname
    if (hostname.startsWith("www.")) {
        hostname = hostname.substring(4, hostname.length)
    } else {
        hostname = hostname.match(/(\w+\.\w+$)/)[0];
    }
    

    // Look through our directory of Domains for potential matches
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
                console.log("NOT FOUND");
            }   
        }   
        var origin = all_locations.length>0? all_locations.toString() : "Unknown";
        console.log("Name: " + owner + " Country: " + origin + " Domain: " + hostname);
    }})

app.listen(5000, ()=>{
    console.log("Server has started");
});