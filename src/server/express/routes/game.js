const LobbyHandler = require('../../utils/LobbyHandler');
const { getPlayerExtensionSockets, getIo } = require('../../extension_socket');
const { create_from_server } = require('./game_history')
const { getMinutesOfDates } = require('../../utils/helpers')

var lobbyHandler = new LobbyHandler();

function _initRaceGameState(lobby) {
    var players = {};
    Object.keys(lobby.playerIds).forEach((pid)=>players[lobby.playerIds[pid]['name']]={"score":0});
    return {"players":players, "game_mode":"Race", "condition": 100, "started_at": new Date(), "room": `ext_${lobby.room}` }
}

function _initCategoryGameState(lobby) {
    var players = {};
    Object.keys(lobby.playerIds).forEach((pid)=>players[lobby.playerIds[pid]['name']]={"score":0});
    return {"players":players, "game_mode":"Category", "condition": "Technology", "started_at": new Date(), "room": `ext_${lobby.room}` }
}

function _build_game_history(lobby, player_game_state){
    var winner_id = Object.keys(lobby.playerIds).find(id => lobby.playerIds[id]["name"] == player_game_state.player);
    var player_data = {}
    Object.keys(player_game_state.game_state.players).forEach((player)=>{
        var player_id = Object.keys(lobby.playerIds).find(id => lobby.playerIds[id]["name"] == player);
        player_data[player] = {};
        player_data[player]["page_history"] = lobby.playerIds[player_id]["page_history"];
        player_data[player]["score"] = player_game_state.game_state.players[player]["score"];
    })
    
    var game_history = {winner_id: winner_id, game_mode: player_game_state.game_state.game_mode, game_date: new Date(),
        player_stats: player_data, 
        game_stats: {time_elapsed: getMinutesOfDates(player_game_state.game_state.started_at, player_game_state.game_state.finished_at), 
            win_condition: player_game_state.game_state.condition}, 
        player_ids: Object.keys(lobby.playerIds)}
    
    create_from_server(game_history);
}

_reset_client_socket_listeners = (socket) =>{
    const listeners = ["userLeftLobby", "disconnect", "chatMessagePlayer"];
    for (var i in listeners){
        socket.removeAllListeners(listeners[i])
    }
}

_rest_ext_socket_listeners = (ext_socket) =>{
    const listeners = ["sendUpdateToAllClients", "playerWon", "playerHistory"]
    for (var i in listeners){
        ext_socket.removeAllListeners(listeners[i])
    }
}

async function _setClientSocketConnections(io, lobby, socket){
    socket.join(lobby.room);

    // reset socket listeners to avoid duplicates
    _reset_client_socket_listeners(socket);

    // lobby events
    socket.on("userLeftLobby", (user_id)=>{
        var temp_user_name = lobby.playerIds[user_id]["name"]
        lobby.removePlayer(user_id);
        
        io.to(lobby.room).emit("userLeft", lobby);
        io.to(lobby.room).emit("chatMessage", {user_name: "lobby", message: `${temp_user_name} has left the lobby`, date: new Date()});
        io.to(`ext_${lobby.room}`).emit("extUserLeft", {user_id: user_id, user_name: temp_user_name});
        
        if (lobby.getNumberOfPlayers()===0){
            lobbyHandler.removeLobby(lobby);
        }
        socket.leave(lobby.room)
    });

    socket.on('disconnect', (data)=> {
        var temp_user_name = lobby.playerIds[lobby.socketPlayerMap[socket.id]]["name"]
        lobby.removePlayer(lobby.socketPlayerMap[socket.id]);

        io.to(lobby.room).emit("userLeft", lobby);
        io.to(lobby.room).emit("chatMessage", {user_name: "lobby", message: `${temp_user_name} has left the lobby`, date: new Date()});
        io.to(`ext_${lobby.room}`).emit("extUserLeft", {user_id: user_id, user_name: temp_user_name});

        socket.leave(lobby.room)
    });

    socket.on('chatMessagePlayer', (messageData)=>{
        io.to(lobby.room).emit("chatMessage", messageData);
    })

}

async function _setExtSocketConnections(io, lobby, ext_room, socket){
    socket.join(ext_room);

    socket.on('sendUpdateToAllClients', async (player_game_state)=>{
        socket.to(ext_room).emit("updateGameState", player_game_state);
    });

    socket.on('playerWon', (player_game_state)=>{
        socket.to(ext_room).emit("winnerFound", player_game_state);
        socket.to(lobby.room).emit("gameFinished", player_game_state);


        // we wait until all players have reported their page history
        // 5 seconds should be more than enough
        // can be changed to check until lobby has page_history attribute for all users
        setTimeout(function(){
            _build_game_history(lobby, player_game_state);
        }, 5000);
        
    });

    socket.on("extServerUserLeft", (data)=>{
        socket.leave(ext_room);
    })

    socket.on('playerHistory', (playerHistory)=>{
        var player_id = Object.keys(lobby.playerIds).find(id => lobby.playerIds[id]["name"] === playerHistory.player);
        lobby.playerIds[player_id]["page_history"] = playerHistory.game_history;
    });
}

async function findGame(req, res){
    var io = getIo();
    try {
        io.emit("identifyExtension", true);
        const { user_id, user_name, socketId, game_mode } = req.body;
        var lobby = lobbyHandler.findOrCreateLobby(game_mode);
        
        lobbyHandler.checkIfPlayerInLobby(user_id);
        
        

        var socket = io.sockets.sockets.get(socketId);
        lobby.addPlayer(socket.id, user_name, user_id);
        await _setClientSocketConnections(io, lobby, socket);
        
        
        // notify all sockets that a user has joined the lobby
        io.to(lobby.room).emit("userJoinedRoom", lobby);
        io.to(lobby.room).emit("chatMessage", {user_name: "lobby", message: `${lobby.playerIds[user_id]["name"]} has joined the lobby`, date: new Date()});

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
            _setExtSocketConnections(io, lobby, extension_room, extension_socket);
        }
        if (lobby.game_mode == "Race"){
            var game_state = _initRaceGameState(lobby);
            io.to(extension_room).emit("gameStartRace", game_state);
        } else {
            var game_state = _initCategoryGameState(lobby);
            io.to(extension_room).emit("gameStartCategory", game_state);
        }
        lobby.in_game = true
        res.status(200).json(game_state);
    } catch (err) {
        console.error(err.message);
        res.status(500).json(err.message);
    }
}

module.exports = {startGame, findGame}