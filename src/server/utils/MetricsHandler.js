const { models } = require('../sequelize');

class MetricsHandler{

    async getPlayerMetrics(player_id){
        var player_metrics = await models.user_metric.findOne({where: {user_id: player_id}});
        return player_metrics
    }


    async handleTrackers(trackers, player_metrics, player_id){
        for (var i in trackers){
            // check if the tracker found is in our list
            if (player_metrics.tracker_list.hasOwnProperty(trackers[i])){

                // if it is in our list, check if the user has found it before
                if (player_metrics.tracker_list[trackers[i]]===false){
                    player_metrics.tracker_list[trackers[i]]=true
                }
            }else{
                // TODO: count unkown trackers
                
            }
            
        }
        // update the users metrics
        var updated = await models.user_metric.update({tracker_list: player_metrics.tracker_list}, { where: {user_id: player_id}})
        console.log("Updated? ", updated)
        
    }

    handleScore(score, player_metrics){
        var prev_total_score = player_metrics.score;

        //TODO: score updating
        console.log(prev_total_score, score)
    }

    async handleMetrics(player_id, player_name, game_state){
        // get players current metrics
        console.log(game_state)
        var player_metrics = await this.getPlayerMetrics(player_id);

        this.handleTrackers(game_state.trackers, player_metrics, player_id);
        this.handleScore(game_state.score, player_metrics);
    }
}

module.exports = MetricsHandler