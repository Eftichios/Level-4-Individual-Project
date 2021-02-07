const { models } = require('../../sequelize');

async function logger(req, res){
    if (req.body.from==="client"){
        await models.client_logger.create(req.body.msg_data);
    }else{
        await models.extension_logger.create(req.body.msg_data);
    }
    res.status(200).json("success")
}

module.exports = {logger}