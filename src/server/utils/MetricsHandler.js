const { models } = require('../sequelize');

class MetricsHandler{

    async getPlayerMetrics(player_id){
        var player_metrics = await models.user_metric.findOne({where: {user_id: player_id}});
        return player_metrics
    }


    async handleTrackers(trackers, player_metrics, player_id){
        var unique_trackers_found = 0
        for (var i in trackers){
            // check if the tracker found is in our list
            if (player_metrics.tracker_list.hasOwnProperty(trackers[i])){
                
                // if it is in our list, check if the user has found it before
                if (player_metrics.tracker_list[trackers[i]]===false){
                    player_metrics.tracker_list[trackers[i]]=true
                    unique_trackers_found +=1
                }
            }else{
                // TODO: count unkown trackers
                
            }
            
        }
        // update the users metrics
        var updated = await models.user_metric.update(
            {tracker_list: player_metrics.tracker_list, 
             tracker_count: player_metrics.tracker_count+unique_trackers_found}, 
            { where: {user_id: player_id}})
        
    }

    handleScore(score, player_metrics){
        var prev_total_score = player_metrics.score;

        //TODO: score updating
    }

    async handleMetrics(player_id, player_name, game_state){
        // get players current metrics
        var player_metrics = await this.getPlayerMetrics(player_id);

        this.handleTrackers(game_state.trackers, player_metrics, player_id);
        this.handleScore(game_state.score, player_metrics);
    }
}

module.exports = MetricsHandler