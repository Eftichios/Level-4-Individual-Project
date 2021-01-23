const { models } = require('../sequelize');

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
             
            { where: {user_id: player_id}})
        
    }

    async handleScore(score, player_metrics, player_id){
        var prev_total_score = player_metrics.score;

        var new_total_score = prev_total_score + score;
        await models.user_metric.update({score: new_total_score}, {where: {user_id: player_id}});
    }

    async handleGameMode(player_metrics, game_mode, player_id){
        if (game_mode==="Race"){
            await models.user_metric.update({race_games: player_metrics.race_games + 1}, {where: {user_id: player_id}});
        }else{
            await models.user_metric.update({category_games: player_metrics.category_games + 1}, {where: {user_id: player_id}});
        }
        
    }

    async handleRaceMetrics(player_id, player_name, game_state){
        // get players current metrics
        var player_metrics = await this.getPlayerMetrics(player_id);

        await this.handleTrackers(game_state.trackers, player_metrics, player_id, game_state.score);
        await this.handleScore(game_state.score, player_metrics, player_id);
        await this.handleGameMode(player_metrics, "Race", player_id);
    }
}

module.exports = MetricsHandler