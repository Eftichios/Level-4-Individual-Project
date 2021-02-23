const { models } = require('../../sequelize');

async function reportBug(req, res){
    const {bug_description, user_name} = req.body;

    await models.bug_report.create({date: new Date(), description: bug_description, user: user_name})
    
    res.status(200).json(true)
}

module.exports = {reportBug}