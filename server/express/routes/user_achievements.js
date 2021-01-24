const { models } = require('../../sequelize');
const { getIdParam } = require('../../utils/helpers');

async function getById(req, res) {
    const id = getIdParam(req);
    const user_achievements = await models.user.findAll({where: 
        {user_id: id}, 
        include:[{model: models.achievement, 
            through: {attributes: ["completed","date_completed","progress"]}}]});
    if (user_achievements){
        res.status(200).json(user_achievements[0]["achievements"]);
    } else {
        res.status(404).json('No achievements found for the user with the given id.');
    }
}

async function update(req, res) {
    const user_id = getIdParam(req); 

    const achievement_id = req.body.achievement_id;
    const achievement = await models.user_achievement.update({completed: req.body.completed}, {where: {achievement_id: achievement_id, user_id: user_id}});

    if (achievement){
        res.status(200).json("Achievement updated succesfully");
    } else {
        res.status(404).json('No achievement found for the given user id and achievements id.');
    }

}

module.exports = {
    getById,
    update
}