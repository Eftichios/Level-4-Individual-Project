const Lobby = require('./Lobby')

class LobbyHandler{
    
    constructor(){
        this.lobbies = [];
    }

    findOrCreateLobby(game_mode){
        for (var i in this.lobbies) {
            if (!this.lobbies[i].isLobbyFull() && this.lobbies[i].game_mode == game_mode && !this.lobbies[i].isLobbyInGame()) {
                return this.lobbies[i];
            }
        }
        var newLobby = new Lobby(game_mode, this.lobbies.length);
        this.addLobby(newLobby);
        return newLobby;
    }

    addLobby(lobby) {
        this.lobbies.push(lobby);
    }

    removeLobby(lobby) {
        this.lobbies = this.lobbies.filter((l) => l.room!==lobby.room);
    }

    getLobbyDetailsByRoom(roomId){
        for (var i in this.lobbies){
            if (this.lobbies[i].room = roomId){
                return this.lobbies[i];
            }
        }
        return null;
    }

    checkIfPlayerInLobby(playerId){
        for (var i in this.lobbies){
            if (this.lobbies[i].playerIds[playerId]){
                throw new Error(`Cannot join a lobby at this time. You are most likely already in a lobby in another browser session/device.`)
            };
        }
    }
}

module.exports = LobbyHandler;