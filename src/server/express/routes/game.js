const LobbyHandler = require('../../utils/LobbyHandler');
const { getPlayerExtensionSockets, getIo } = require('../../extension_socket');

var lobbyHandler = new LobbyHandler();

function _initRaceGameState(lobby) {
    var players = {};
    Object.keys(lobby.playerIds).forEach((pid)=>players[lobby.playerIds[pid]['name']]=0);
    return {"players":players, "game_mode":"Race", "condition": 100, "started_at": new Date(), "room": `ext_${lobby.room}` }
}

async function _setClientSocketConnections(io, lobby, socket){
    socket.join(lobby.room);

    // lobby events
    socket.on("userLeftLobby", (user_id)=>{
        lobby.removePlayer(user_id);
        io.to(lobby.room).emit("userLeft", lobby);
        if (lobby.getNumberOfPlayers()===0){
            lobbyHandler.removeLobby(lobby);
        }
    });

    socket.on('disconnect', (data)=> {
        lobby.removePlayer(lobby.socketPlayerMap[socket.id]);
        io.to(lobby.room).emit("userLeft", lobby);
    });

}

async function _setExtSocketConnections(io, lobby_room, ext_room, socket){
    socket.join(ext_room);

    socket.on('sendUpdateToAllClients', async (player_game_state)=>{
        io.to(ext_room).emit("updateGameState", player_game_state);
    });

    socket.on('playerWon', (player_game_state)=>{
        io.to(ext_room).emit("winnerFound", player_game_state);
        io.to(lobby_room).emit("gameFinished", player_game_state);
    });

}

async function findGame(req, res){
    var io = getIo();
    try {
        io.emit("identifyExtension", true);
        var lobby = lobbyHandler.findOrCreateLobby("Race");
        const { user_id, user_name, socketId } = req.body;
        lobbyHandler.checkIfPlayerInLobby(user_id);
        
        

        var socket = io.sockets.sockets.get(socketId);
        lobby.addPlayer(socket.id, user_name, user_id);
        await _setClientSocketConnections(io, lobby, socket);
        
        
        // notify all sockets that a user has joined the lobby
        io.to(lobby.room).emit("userJoinedRoom", lobby);

        res.status(200).json({'success':true, 'lobby':lobby});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({'success':false, 'error':err.message});
    }
}

async function startGame(req, res){
    var io = getIo();
    try{
    var playerExtensionSocket = getPlayerExtensionSockets();
        var {room} = req.body;
        var lobby = lobbyHandler.getLobbyDetailsByRoom(room);
        var extension_room = `ext_${room}`;
        for (pid in lobby.playerIds){           
            var extension_socket = io.sockets.sockets.get(playerExtensionSocket[pid]);
            _setExtSocketConnections(io, lobby.room, extension_room, extension_socket);
        }
        var game_state = _initRaceGameState(lobby);
        io.to(extension_room).emit("gameStart", game_state);
        res.status(200).json(game_state);
    } catch (err) {
        console.error(err.message);
        res.status(500).json(err.message);
    }
}

module.exports = {startGame, findGame}