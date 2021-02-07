const { models } = require("../sequelize");

async function save_log(req,res){
    const method = req.method;
    const endpoint = req.originalUrl;

    res.on('finish', async () => {
        const log_entry = {date: new Date(), method: method, endpoint: endpoint, req_body: JSON.stringify(req.body), res_body:res.body?JSON.stringify(req.body):"" }
        await models.server_logger.create(log_entry);
    });
}

module.exports = save_log