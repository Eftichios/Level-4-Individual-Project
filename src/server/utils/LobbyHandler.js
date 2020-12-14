const Lobby = require('./Lobby')

class LobbyHandler{
    
    constructor(){
        this.lobbies = [];
    }

    findOrCreateLobby(game_mode){
        for (var i in this.lobbies) {
            if (!this.lobbies[i].isLobbyFull()) {
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
        this.lobbies = this.lobbies.filter((l) => l!==lobby);
    }

    getLobbyDetailsByRoom(roomId){
        for (var i in this.lobbies){
            if (this.lobbies[i].room = roomId){
                return this.lobbies[i];
            }
        }
        return null;
    }
}

module.exports = LobbyHandler;