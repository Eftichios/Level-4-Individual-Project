var fs = require('fs')
var path = require('path')

async function create(req, res){
    var accessLogStreamClient = fs.createWriteStream(path.join(__dirname, 'logs',"client_log.log"), { flags: 'a' })
    accessLogStreamClient.write(JSON.stringify(req.body)+"\n")
    res.status(204)
}

module.exports = {create}