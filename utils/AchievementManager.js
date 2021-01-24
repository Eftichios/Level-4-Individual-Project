const { models } = require('../sequelize');

class AchievementManager{

    async getUserRaceAchievements(user_id){
        const user_achievements = await models.user.findAll({where: 
            {user_id: user_id}, 
            include:[{model: models.achievement, where: {game_mode: "Race"},
                through: {attributes: ["completed","date_completed","progress"]}}]});
        if (user_achievements){
            return user_achievements[0]["achievements"]
        }else {
            return null;
        }
    }

    async checkUniqueTrackers(user_id, unique_trackers, achievements){
        var code = "unique_trackers";
        Object.entries(achievements).filter((key,value)=>key[1].code===code && !key[1].user_achievement.completed).forEach(async ([key,value])=>{
            if (unique_trackers > value.condition){
                await models.user_achievement.update({completed: true, date_completed: new Date(), progress: value.condition}, 
                {where: {achievement_id: value.achievement_id, user_id: user_id}});
            } else {
                await models.user_achievement.update({progress: unique_trackers}, {where: {achievement_id: value.achievement_id, user_id: user_id}});
            }
        })
    }

    async checkTotalTrackers(user_id, total_trackers, achievements){
        var code = "total_trackers";
        Object.entries(achievements).filter((key,value)=>key[1].code===code && !key[1].user_achievement.completed).forEach(async ([key,value])=>{
            if (total_trackers > value.condition){
                await models.user_achievement.update({completed: true, date_completed: new Date(), progress: value.condition}, 
                {where: {achievement_id: value.achievement_id, user_id: user_id}});
            } else {
                await models.user_achievement.update({progress: total_trackers}, {where: {achievement_id: value.achievement_id, user_id: user_id}});
            }
        })
    }

    async checkScore(user_id, score_update, achievements){
        return
    }

    async checkGamesPlayed(user_id, games_played_update, achievements, mode){
        var code = mode==="Race"?"race_mode":"category_mode";
        Object.entries(achievements).filter((key,value)=>key[1].code===code && !key[1].user_achievement.completed).forEach(async ([key,value])=>{
            if (games_played_update >= value.condition){
                await models.user_achievement.update({completed: true, date_completed: new Date(), progress: value.condition}, 
                {where: {achievement_id: value.achievement_id, user_id: user_id}});
            } else {
                await models.user_achievement.update({progress: games_played_update}, {where: {achievement_id: value.achievement_id, user_id: user_id}});
            }
        })
    }

    async checkGamesWon(user_id, is_winner, achievements, mode){
        var code = mode==="Race"?"games_won_race":"games_won_category";
        Object.entries(achievements).filter((key,value)=>key[1].code===code && !key[1].user_achievement.completed).forEach(async ([key,value])=>{
            if (is_winner && value.user_achievement.progress + 1 >= value.condition){
                await models.user_achievement.update({completed: true, date_completed: new Date(), progress: value.condition}, 
                {where: {achievement_id: value.achievement_id, user_id: user_id}});
            } else {
                await models.user_achievement.update({progress: value.user_achievement.progress+1}, {where: {achievement_id: value.achievement_id, user_id: user_id}});
            }
        })
    }

    async checkForRaceAchievements(user_id, unique_trackers, total_trackers, score_update, games_played_update, is_winner){

        var achievements = await this.getUserRaceAchievements(user_id);
        if (!achievements){
            return
        }

        await this.checkUniqueTrackers(user_id, unique_trackers, achievements);
        await this.checkTotalTrackers(user_id, total_trackers, achievements);
        await this.checkScore(user_id, score_update, achievements);
        await this.checkGamesPlayed(user_id, games_played_update, achievements, "Race");
        await this.checkGamesWon(user_id, is_winner, achievements, "Race");
    }
}

module.exports = AchievementManager