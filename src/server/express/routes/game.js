const LobbyHandler = require('../../utils/LobbyHandler');

var io = null;
var lobbyHandler = new LobbyHandler();

function _initGameState(player) {
    return {"players":{[player]: 0}, "game_mode":"Race", "condition": 1, "started_at": new Date() }
}

async function setIo(_io) {
    io = _io;
}

async function play(req, res){
    try {
        var lobby = lobbyHandler.findOrCreateLobby("Race");
        const { user_name, socketId } = req.body;
        io.sockets.sockets.get(socketId).join(lobby.room, function (){
            console.log("User joined room:",lobby.room)
        });
        // // initialise game state
        // var game_state = _initGameState(user_name);
        io.to(lobby.room).emit("userJoinedRoom", user_name);
        // // send message to chrome extension
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