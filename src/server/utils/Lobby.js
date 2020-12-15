class Lobby {
    
    constructor(game_mode, index){
        this.MAX_players = 5;
        this.playerIds = {}
        this.game_mode = game_mode;
        this.room = "Room" + index;
    }

    isLobbyFull(){
        return Object.keys(this.playerIds).length >= this.MAX_players;
    }

    isPlayerInLobby(playerId) {
        return playerId in this.playerIds;
    }

    addPlayer(user_name, playerId) {
        if (!this.isLobbyFull() && !this.isPlayerInLobby() ){
            this.playerIds[playerId] = {"name": user_name, "ready": false};
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
        const isNotReady = (pid) => !this.playerIds[pid]["ready"];

        return !Object.values(this.playerIds).some(isNotReady);
    }

    getNumberOfPlayers(){
        return Object.keys(this.playerIds).length;
    }
}

module.exports = Lobby