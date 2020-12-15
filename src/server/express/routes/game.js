const LobbyHandler = require('../../utils/LobbyHandler');
const { getPlayerExtensionSockets, getIo } = require('../../extension_socket');

var lobbyHandler = new LobbyHandler();

function _initRaceGameState(lobby) {
    var players = {};
    Object.keys(lobby.playerIds).forEach((pid)=>players[pid]=0);
    return {"players":players, "game_mode":"Race", "condition": 10, "started_at": new Date() }
}

function _setSocketConnections(io, lobby, socket){
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

    // extension events

}

async function findGame(req, res){
    var io = getIo();
    try {
        io.emit("identifyExtension", true);
        var lobby = lobbyHandler.findOrCreateLobby("Race");
        const { user_id, user_name, socketId } = req.body;
        
        var socket = io.sockets.sockets.get(socketId);
        _setSocketConnections(io, lobby, socket);
        
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
    var playerExtensionSocket = getPlayerExtensionSockets();
    console.log(playerExtensionSocket);
    try{
        var {room} = req.body;
        var lobby = lobbyHandler.getLobbyDetailsByRoom(room);
        var game_state = _initRaceGameState(lobby);
        res.status(200).json(game_state);
    } catch (err) {
        console.error(err.message);
        res.status(500).json(err.message);
    }
}

module.exports = {startGame, findGame}