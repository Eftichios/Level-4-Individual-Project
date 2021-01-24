const { models } = require('../../sequelize');
const { getIdParam } = require('../../utils/helpers');


async function getAll(req, res) {
    const achievements = await models.achievement.findAll();
    res.status(200).json(achievements);
}

async function getById(req, res) {
    const achievement_id = getIdParam(req);
    const achievement = await models.achievement.findByPk(achievement_id);
    if (achievement){
        res.status(200).json(achievement);
    } else {
        res.status(404).json('No achievement exists with the given id.');
    }
}

async function remove(req, res) {
    const id = getIdParam(req);
    
    await models.achievement.destroy({
        where: {
            achievement_id:id
        }
    });
    res.status(200).json("Achievement deleted succesfully.")
}


module.exports = {
    getAll,
    getById,
    remove
}