const { models } = require('../../sequelize');
const { getIdParam } = require('../../utils/helpers');

async function getById(req, res) {
    const id = getIdParam(req);
    const user_metrics = await models.user_metric.findOne({where: {user_id: id}});
    if (user_metrics){
        res.status(200).json(user_metrics);
    } else {
        res.status(404).json("No metrics found for user with given id");
    }
}

module.exports = {
    getById,
}