const LobbyHandler = require('../../utils/LobbyHandler');

var io = null;
var lobbyHandler = new LobbyHandler();

function _initGameState(player) {
    return {"players":{[player]: 0}, "game_mode":"Race", "condition": 1, "started_at": new Date() }
}

async function setIo(_io) {
    io = _io;
}

function _setSocketConnections(lobby, socket){
    socket.join(lobby.room);
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
    })
}

async function play(req, res){
    try {
        var lobby = lobbyHandler.findOrCreateLobby("Race");
        const { user_id, user_name, socketId } = req.body;
        
        var socket = io.sockets.sockets.get(socketId);
        _setSocketConnections(lobby, socket);
        
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

async function stop(req, res){
    io.emit('gameStop', "Player has quit the game");
    res.status(200).json(true);
}

module.exports = {play, stop, setIo}