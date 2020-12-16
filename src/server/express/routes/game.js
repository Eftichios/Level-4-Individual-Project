const LobbyHandler = require('../../utils/LobbyHandler');
const { getPlayerExtensionSockets, getIo } = require('../../extension_socket');

var lobbyHandler = new LobbyHandler();

function _initRaceGameState(lobby) {
    var players = {};
    Object.keys(lobby.playerIds).forEach((pid)=>players[pid]=0);
    return {"players":players, "game_mode":"Race", "condition": 10, "started_at": new Date() }
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
        console.log("USER CLOSED TAB/BROWSER", socket.id);
        console.log(lobby.socketPlayerMap[socket.id]);
        lobby.removePlayer(lobby.socketPlayerMap[socket.id]);
        io.to(lobby.room).emit("userLeft", lobby);
    });

}

async function _setExtSocketConnections(io, lobby, socket){
    // TODO: set up game state update communication

}

async function findGame(req, res){
    var io = getIo();
    try {
        io.emit("identifyExtension", true);
        var lobby = lobbyHandler.findOrCreateLobby("Race");
        const { user_id, user_name, socketId } = req.body;
        
        var socket = io.sockets.sockets.get(socketId);
        await _setClientSocketConnections(io, lobby, socket);
        
        // // initialise game state
        lobby.addPlayer(socket.id, user_name, user_id);
        
        // notify all sockets that a user has joined the lobby
        io.to(lobby.room).emit("userJoinedRoom", lobby);

        res.status(200).json(lobby);
    } catch (err) {
        console.error(err.message);
        res.status(500).json(false);
    }
}

async function startGame(req, res){
    var io = getIo();
    try{
    var playerExtensionSocket = getPlayerExtensionSockets();
        var {room} = req.body;
        var lobby = lobbyHandler.getLobbyDetailsByRoom(room);
        var extension_room = `$ext_${room}`;
        for (pid in lobby.playerIds){           
            var extension_socket = io.sockets.sockets.get(playerExtensionSocket[pid]);
            extension_socket.join(extension_room, async ()=>{});
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