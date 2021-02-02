const { models } = require('../sequelize');
const AchievementManager = require('./AchievementManager');

var achievementManager = new AchievementManager();

class MetricsHandler{

    async getPlayerMetrics(player_id){
        var player_metrics = await models.user_metric.findOne({where: {user_id: player_id}});
        return player_metrics
    }


    async handleTrackers(trackers, player_metrics, player_id, score){
        var unique_trackers_found = 0
        for (var i in trackers){
            // check if the tracker found is in our list
            if (player_metrics.tracker_list.hasOwnProperty(trackers[i])){
                
                // if it is in our list, check if the user has found it before
                if (player_metrics.tracker_list[trackers[i]]["found"]===false){
                    player_metrics.tracker_list[trackers[i]]["found"]=true
                    unique_trackers_found +=1
                }
            }
        }
        
        // update the users metrics
        var updated = await models.user_metric.update(
            {tracker_list: player_metrics.tracker_list, 
             tracker_count: player_metrics.tracker_count+unique_trackers_found,
             total_ad_trackers: player_metrics.total_ad_trackers+score}, 
            { where: {user_id: player_id}});
        
        return {"unique_trackers": player_metrics.tracker_count+unique_trackers_found,
                "total_trackers": player_metrics.total_ad_trackers+score}
    }

    async handleScore(score, player_metrics, player_id){
        var prev_total_score = player_metrics.score;

        var new_total_score = prev_total_score + score;
        await models.user_metric.update({score: new_total_score}, {where: {user_id: player_id}});
        return new_total_score;
    }

    async handleGameMode(player_metrics, game_mode, player_id){
        if (game_mode==="Race"){
            await models.user_metric.update({race_games: player_metrics.race_games + 1}, {where: {user_id: player_id}});
            return player_metrics.race_games + 1
        }else{
            await models.user_metric.update({category_games: player_metrics.category_games + 1}, {where: {user_id: player_id}});
            return player_metrics.category_games + 1
        }   
        
    }

    async handleRaceMetrics(player_id, player_name, game_state, is_winner){
        // get players current metrics
        var player_metrics = await this.getPlayerMetrics(player_id);

        var tracker_update = await this.handleTrackers(game_state.trackers, player_metrics, player_id, game_state.score);
        var score_update = await this.handleScore(game_state.score, player_metrics, player_id);
        var games_played_update = await this.handleGameMode(player_metrics, "Race", player_id);
        achievementManager.checkForRaceAchievements(player_id, tracker_update.unique_trackers, tracker_update.total_trackers, score_update, games_played_update, is_winner)
    }

    async handleCategories(new_categories, player_metrics, player_id){
        new_categories.forEach((cat)=>{
            player_metrics.categories_count[cat]+=1
        });

        await models.user_metric.update({categories_count: player_metrics.categories_count}, {where: {user_id: player_id}});
        return player_metrics.categories_count;
    }

    async handleCategoryMetrics(player_id, player_name, game_state, is_winner){
        var player_metrics = await this.getPlayerMetrics(player_id);

        var new_cat_count = await this.handleCategories(game_state.categories, player_metrics, player_id);
        var games_played_update = await this.handleGameMode(player_metrics, "Category", player_id);

        achievementManager.checkForCategoryAchievements(player_id, new_cat_count, games_played_update, is_winner);

    }
}

module.exports = MetricsHandler