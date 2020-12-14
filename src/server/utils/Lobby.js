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

    addPlayer(playerId) {
        if (!this.isLobbyFull && !this.isPlayerInLobby ){
            this.playerIds[playerId] = false;
        }
    }

    removePlayer(playerId) {
        if (this.isPlayerInLobby){
            delete this.playerIds[playerId];
        }
    }

    playerToggleReady(playerId, ready) {
        if (this.isPlayerInLobby){
            this.playerIds[playerId] = ready;
        }
    }

    checkIfAllReady() {
        const isNotReady = (ready) => !ready;

        return !Object.values(this.playerIds).some(isNotReady);
    }
}

module.exports = Lobby