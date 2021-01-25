const { models } = require('../../sequelize');
const { getIdParam } = require('../../utils/helpers');

async function getById(req, res) {
    const id = getIdParam(req);
    const user_metrics = await models.user_metric.findOne({where: {user_id: id}, attributes: {exclude:["tracker_list"]}});
    if (user_metrics){
        res.status(200).json(user_metrics);
    } else {
        res.status(404).json("No metrics found for user with given id");
    }
}

async function getAll(req, res){
    const user_metrics = await models.user.findAll({attributes: ['user_name'], include: [{model: models.user_metric, attributes: ["tracker_count"]}]});
    if (user_metrics){
        res.status(200).json(user_metrics)
    } else {
        res.status(404).json("Player scores could not be retreived.")
    }
}

async function getTrackerList(req, res){
    const {user_id, offset} = req.body;
    const user_metrics = await models.user_metric.findOne({where: {user_id: user_id}, attributes:['tracker_list']});
    var tracker_list = user_metrics["tracker_list"];
    var total_size = Object.entries(tracker_list).length
    var found_size = Object.entries(tracker_list).filter((key,value)=>key[1]["found"]===true).length
    tracker_list = Object.entries(tracker_list).sort((a,b)=>b[1]["extra_info"]-a[1]["extra_info"]).slice(offset*500, offset*500 +500)
    if (tracker_list){
        res.status(200).json({trackers: tracker_list, total_size: total_size, found_size: found_size, not_found_size: total_size-found_size });
    }else {
        res.status(404).json("Tracker list could not be retrieved");
    }
}

module.exports = {
    getById,
    getAll,
    getTrackerList
}