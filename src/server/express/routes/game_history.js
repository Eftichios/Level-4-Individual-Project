const { models } = require('../../sequelize');
const { getIdParam } = require('../../utils/helpers');
const { Op } = require('sequelize'); 

async function getById(req, res) {
    const user_id = getIdParam(req);
    const user_game_history = await models.game_history.findAll({where: {player_ids: { [Op.contains]: [user_id] }}});
    if (user_game_history){
        res.status(200).json(user_game_history);
    } else {
        res.status(404).json('No game history found for the user with the given id.');
    }
}

async function create(req, res) {
    await models.game_history.create(req.body);
    res.status(200).json(true);
}

async function create_race_from_server(game_history){
    await models.game_history.create(game_history);
}

async function create_category_from_server(game_history){
    await models.game_history.create(game_history);
}

module.exports = {
    getById,
    create,
    create_race_from_server,
    create_category_from_server
}