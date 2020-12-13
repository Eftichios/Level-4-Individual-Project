const { models } = require('../../sequelize');
const { getIdParam } = require('../../utils/helpers');


async function getAll(req, res) {
    const trade_requests = await models.market.findAll();
    res.status(200).json(trade_requests);
}

async function getById(req, res) {
    const user_id = getIdParam(req);
    const trade_requests = await models.market.findAll({where: {player_1: user_id}});
    if (trade_requests){
        res.status(200).json(trade_requests);
    } else {
        res.status(404).json('No trade requests found for this user.');
    }
}

async function remove(req, res) {
    const id = getIdParam(req);
    
    await models.market.destroy({
        where: {
            trade_id:id
        }
    });
    res.status(200).json("Trade request deleted succesfully.")
}

async function create(req, res) {
    await models.market.create(req.body);
    res.status(201).json(true);
}

module.exports = {
    getAll,
    getById,
    remove,
    create
}