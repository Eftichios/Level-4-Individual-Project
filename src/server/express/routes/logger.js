const { models } = require('../../sequelize');

async function getAllLogs(req, res){
    if (req.body.from==="client"){
        var logs = await models.client_logger.findAll();
    }else{
        var logs = await models.extension_logger.findAll();
    }
    if (logs.length > 0){
        res.status(200).json(logs)
    } else {
        res.status(404).json("No logs found")
    }
    
}

async function logger(req, res){
    if (req.body.from==="client"){
        await models.client_logger.create(req.body.msg_data);
    }else{
        await models.extension_logger.create(req.body.msg_data);
    }
    res.status(200).json("success")
}

module.exports = {logger, getAllLogs}