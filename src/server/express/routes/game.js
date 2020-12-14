var io = null;

function _initGameState(player) {
    return {"players":{[player]: 0}, "game_mode":"Race", "condition": 1, "started_at": new Date() }
}

async function setIo(_io) {
    io = _io;
}

async function play(req, res){
    try {
        const { user_name } = req.body;

        // initialise game state
        var game_state = _initGameState(user_name);
        
        // send message to chrome extension
        io.emit('gameStart', {"player": user_name, "game_state": game_state});
        res.status(200).json(true);
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