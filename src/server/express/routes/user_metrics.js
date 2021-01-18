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

async function getAll(req, res){
    const user_metrics = await models.user.findAll({attributes: ['user_name'], include: [models.user_metric]});
    if (user_metrics){
        res.status(200).json(user_metrics)
    } else {
        res.status(404).json("Player scores could not be retreived.")
    }
}

module.exports = {
    getById,
    getAll
}