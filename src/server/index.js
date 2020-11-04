const express = require('express');
const cors = require('cors');
//const pool = require("./db");

app = express();

app.use(cors());

app.get("/index", async(req, res)=>{
    res.send("Server says hi!");
})

app.listen(5000, ()=>{
    console.log("Server has started");
});