const LobbyHandler = require('../../utils/LobbyHandler');
const MetricsHandler = require('../../utils/MetricsHandler');
const { getPlayerExtensionSockets, getIo } = require('../../extension_socket');
const { create_race_from_server, create_category_from_server } = require('./game_history')
const { getMinutesOfDates } = require('../../utils/helpers')

var lobbyHandler = new LobbyHandler();
var metricsHandler = new MetricsHandler();

function _initRaceGameState(lobby) {
    var players = {};
    Object.keys(lobby.playerIds).forEach((pid)=>players[lobby.playerIds[pid]['name']]={"score":0, "trackers":[]});
    return {"players":players, "game_mode":"Race", "condition": 5, "started_at": new Date(), "room": `ext_${lobby.room}` }
}

function _initCategoryGameState(lobby) {
    var players = {};
    Object.keys(lobby.playerIds).forEach((pid)=>players[lobby.playerIds[pid]['name']]={"categories":[]});
    return {"players":players, "game_mode":"Category", "condition": lobby.condition, "started_at": new Date(), "room": `ext_${lobby.room}` }
}

function _build_race_game_history(io, lobby, player_game_state){
    var winner_id = Object.keys(lobby.playerIds).find(id => lobby.playerIds[id]["name"] == player_game_state.player);
    var player_data = {}
    Object.keys(player_game_state.game_state.players).forEach((player)=>{
        var player_id = Object.keys(lobby.playerIds).find(id => lobby.playerIds[id]["name"] == player);

        // handle metrics
        metricsHandler.handleRaceMetrics(player_id, player, player_game_state.game_state.players[player], winner_id===player_id);
        player_data[player] = {};
        player_data[player]["page_history"] = lobby.playerIds[player_id]["page_history"];
        player_data[player]["score"] = player_game_state.game_state.players[player]["score"];
    })
    
    var game_history = {winner_id: winner_id, winner_name: player_game_state.player, game_mode: player_game_state.game_state.game_mode, game_date: new Date(),
        player_stats: player_data, 
        game_stats: {time_elapsed: getMinutesOfDates(player_game_state.game_state.started_at, player_game_state.game_state.finished_at), 
            win_condition: player_game_state.game_state.condition}, 
        player_ids: Object.keys(lobby.playerIds)}
    
    
    io.to(lobby.room).emit("gameFinished", {summary: player_game_state, player_metrics: player_data});
    create_race_from_server(game_history);

}

function _build_category_game_history(io, lobby, player_game_state){
    var winner_id = Object.keys(lobby.playerIds).find(id => lobby.playerIds[id]["name"] == player_game_state.player);
    var player_data = {}
    Object.keys(player_game_state.game_state.players).forEach((player)=>{
        var player_id = Object.keys(lobby.playerIds).find(id => lobby.playerIds[id]["name"] == player);

        // handle metrics
        metricsHandler.handleCategoryMetrics(player_id, player, player_game_state.game_state.players[player], winner_id===player_id);
        player_data[player] = {};
        player_data[player]["categories"] = player_game_state.game_state.players[player]["categories"];
    })
    
    var game_history = {winner_id: winner_id, winner_name: player_game_state.player, game_mode: player_game_state.game_state.game_mode, game_date: new Date(),
        player_stats: player_data, 
        game_stats: {time_elapsed: getMinutesOfDates(player_game_state.game_state.started_at, player_game_state.game_state.finished_at), 
            win_condition: player_game_state.game_state.condition}, 
        player_ids: Object.keys(lobby.playerIds)}
    
    
    io.to(lobby.room).emit("gameFinished", {summary: player_game_state, player_metrics: player_data});
    create_category_from_server(game_history);
}

_reset_client_socket_listeners = (socket) =>{
    const listeners = ["userLeftLobby", "disconnect", "chatMessagePlayer", 'playerToggledReady'];
    for (var i in listeners){
        socket.removeAllListeners(listeners[i])
    }
}

_reset_ext_socket_listeners = (ext_socket) =>{
    const listeners = ["sendUpdateToAllClients", "playerWon", "playerHistory", "extensionError"]
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
        if (!lobby.isPlayerInLobby(user_id)){
            socket.leave(lobby.room)
            return
        }
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
        if (!lobby.playerIds[lobby.socketPlayerMap[socket.id]]){
            socket.leave(lobby.room)
            return
        }
        var temp_user_name = lobby.playerIds[lobby.socketPlayerMap[socket.id]]["name"]
        var temp_user_id = lobby.socketPlayerMap[socket.id]
        lobby.removePlayer(temp_user_id);

        io.to(lobby.room).emit("userLeft", lobby);
        io.to(lobby.room).emit("chatMessage", {user_name: "lobby", message: `${temp_user_name} has left the lobby`, date: new Date()});
        io.to(`ext_${lobby.room}`).emit("extUserLeft", {user_id: temp_user_id, user_name: temp_user_name});

        if (lobby.getNumberOfPlayers()===0){
            lobbyHandler.removeLobby(lobby);
        }

        socket.leave(lobby.room)
    });

    socket.on('chatMessagePlayer', (messageData)=>{
        io.to(lobby.room).emit("chatMessage", messageData);
    })

    socket.on('playerToggledReady', (user_data)=>{
        lobby.playerIds[user_data.user_id]["ready"] = user_data.is_ready;
        io.to(lobby.room).emit("allReady", {are_all_ready: lobby.checkIfAllReady(), new_lobby: lobby})
    })

}

async function _setExtSocketConnections(io, lobby, ext_room, socket){
    socket.join(ext_room);

    _reset_ext_socket_listeners(socket);

    socket.on('sendUpdateToAllClients', async (player_game_state)=>{
        socket.to(ext_room).emit("updateGameState", player_game_state);
    });

    socket.on('playerWon', (player_game_state)=>{
        socket.to(ext_room).emit("winnerFound", player_game_state);

        // set the game state of the lobby so that we can build the game history
        lobby.game_state = player_game_state

        if (player_game_state.game_state.game_mode==="Category"){
            _build_category_game_history(io, lobby, player_game_state)
        }
    });

    socket.on('extensionError', (error_data)=>{
        if (socket.user_name === error_data.player){
            io.to(lobby.room).emit("ext_error", socket.user_name);
        }
    });

    socket.on("extServerUserLeft", (user_name)=>{
        if (user_name === socket.user_name){
            socket.leave(ext_room);
        }
        
    })

    socket.on('playerHistory', (playerHistory)=>{
        var player_id = Object.keys(lobby.playerIds).find(id => lobby.playerIds[id]["name"] === playerHistory.player);
        lobby.playerIds[player_id]["page_history"] = playerHistory.game_history;

        // check if we have received page history for all players currently in the lobby
        // if we have, then build the game history
        var received_from_all = lobby.checkForPageHistory();
        if (received_from_all){
            _build_race_game_history(io, lobby, lobby.game_state)
        }
    });
}

function waitForExtensionResponse(ms){
    return new Promise(resolve=>setTimeout(resolve, ms))
}

async function checkIfExtensionConfigured(user_id){
    var ext_sockets = getPlayerExtensionSockets();
    if (!ext_sockets[user_id]){
        throw new Error("Please ensure that you have the chrome extension installed and that you have entered your username correctly.")
    }
}

async function findGame(req, res){
    var io = getIo();
        
    const { user_id, user_name, socketId, game_mode } = req.body;
    io.emit("identifyExtension", {user_name, user_id});

    // put a timer to wait for the extension to respond
    await waitForExtensionResponse(3000);
    await checkIfExtensionConfigured(user_id);
        

    var lobby = lobbyHandler.findOrCreateLobby(game_mode);
        
    lobbyHandler.checkIfPlayerInLobby(user_id);
        
        

    var socket = io.sockets.sockets.get(socketId);
    if (socket){
        lobby.addPlayer(socket.id, user_name, user_id);
        await _setClientSocketConnections(io, lobby, socket);
            
            
        // notify all sockets that a user has joined the lobby
        io.to(lobby.room).emit("userJoinedRoom", lobby);
        io.to(lobby.room).emit("chatMessage", {user_name: "lobby", message: `${lobby.playerIds[user_id]["name"]} has joined the lobby`, date: new Date()});
    
        res.status(200).json({'success':true, 'lobby':lobby});
    } else {
        
        res.status(400).json("Unable to find game at this time. Try refreshing the page and trying again.");
    }
    lobbyHandler.clearEmptyLobbies();
    
}

async function startGame(req, res){
    var io = getIo();
    var playerExtensionSocket = getPlayerExtensionSockets();
    var {room, condition} = req.body;
    var lobby = lobbyHandler.getLobbyDetailsByRoom(room);
    var extension_room = `ext_${room}`;
    for (pid in lobby.playerIds){           
        var extension_socket = io.sockets.sockets.get(playerExtensionSocket[pid]);
        extension_socket.user_name = lobby.playerIds[pid]["name"];
        _setExtSocketConnections(io, lobby, extension_room, extension_socket);
    }
    if (lobby.game_mode == "Race"){
        var game_state = _initRaceGameState(lobby, condition);
        io.to(extension_room).emit("gameStartRace", game_state);
    } else {
        var game_state = _initCategoryGameState(lobby, condition);
        io.to(extension_room).emit("gameStartCategory", game_state);
    }
    lobby.in_game = true
    io.to(lobby.room).emit("gameStarted", true);
    res.status(200).json({'success':true, "game_state":game_state});
}

module.exports = {startGame, findGame}