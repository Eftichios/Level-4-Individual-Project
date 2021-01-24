var fs = require('fs')
var path = require('path')

async function logger(req, res){
    if (req.body.from==="client"){
        var accessLogStreamClient = fs.createWriteStream(path.join(__dirname, 'logs',"client_log.log"), { flags: 'a' })
    }else{
        var accessLogStreamClient = fs.createWriteStream(path.join(__dirname, 'logs',"extension_log.log"), { flags: 'a' })
    }
    accessLogStreamClient.write(JSON.stringify(req.body.msg_data)+"\n")
    res.status(200).json("success")
}

module.exports = {logger}