const express = require('express');
const cors = require('cors');
//const pool = require("./db");

app = express();

app.use(cors());
app.use(express.json())

app.get("/index", async(req, res)=>{
    res.send("Server says hi!");
})

app.post('/extension', function (req, res) {
    res.send('POST request to the extensions');
    console.log(req.body);
  })

app.listen(5000, ()=>{
    console.log("Server has started");
});