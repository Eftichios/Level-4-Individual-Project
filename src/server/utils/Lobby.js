const { getCategoryMap } = require("./helpers");


class Lobby {
    
    constructor(game_mode, index){
        this.MAX_players = 5;
        this.playerIds = {}
        this.game_mode = game_mode;
        this.room = "Room" + index;
        this.socketPlayerMap = {};
        this.condition = this.randomCondition();
        this.in_game = false;
        this.game_state = null;
    }

    randomCondition(){
        var possible_trackers = [50, 100, 200, 300]
        var category_map = getCategoryMap()
        if (this.game_mode==="Race"){
            return possible_trackers[Math.floor(Math.random() * possible_trackers.length)]
        } else {
            return category_map[Math.floor(Math.random() * category_map.length)];
        }
    }

    isLobbyFull(){
        return Object.keys(this.playerIds).length >= this.MAX_players;
    }

    isLobbyInGame(){
        return this.in_game
    }

    isPlayerInLobby(playerId) {
        return playerId in this.playerIds;
    }

    addPlayer(socketId, user_name, playerId, profile) {
        if (!this.isLobbyFull() && !this.isPlayerInLobby() ){
            this.playerIds[playerId] = {"name": user_name, "ready": false, "profile": profile};
            this.socketPlayerMap[socketId] = playerId;
        }
    }

    removePlayer(playerId) {
        if (this.isPlayerInLobby){
            delete this.playerIds[playerId];
        }
    }

    playerToggleReady(playerId, ready) {
        if (this.isPlayerInLobby){
            this.playerIds[playerId]["ready"] = ready
        }
    }

    checkIfAllReady() {
        var all_ready = true
        Object.entries(this.playerIds).forEach(([key,value])=>{
            if (!value["ready"]){
                all_ready = false
                return
            }
        })
        return all_ready
    }

    getNumberOfPlayers(){
        return Object.keys(this.playerIds).length;
    }

    checkForPageHistory(){
        var all_history = true
        Object.entries(this.playerIds).forEach(([key, value])=>{
            if (!value.hasOwnProperty("page_history")){
                all_history = false
                return
            }
        });
        return all_history
    }
}

module.exports = Lobby