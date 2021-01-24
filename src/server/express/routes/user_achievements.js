const { models } = require('../../sequelize');
const { getIdParam } = require('../../utils/helpers');

function parseUserAchievements(user_achievements, all_achievements){
    for (var i in all_achievements){
        var cur_achiev = all_achievements[i];
        for (var j in user_achievements){
            var cur_user_achiev = user_achievements[j];
            if (cur_user_achiev["completed"] && cur_user_achiev["achievement_id"]===cur_achiev["achievement_id"]){
                all_achievements[i]["dataValues"]["completed"] = true
                break;
            }
            all_achievements[i]["dataValues"]["completed"] = false
        }
    }
    return all_achievements
}


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