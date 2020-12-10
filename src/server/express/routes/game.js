var socket = null;

async function setSocket(_socket) {
    socket = _socket;
}

async function play(req, res){
    // send message to chrome extension only
    socket.emit('gameStart', "Game has started");
    res.status(200).json(true);
}

async function stop(req, res){
    socket.emit('gameStop', "Plyaer has quit the game");
    res.status(200).json(true);
}

module.exports = {play, stop, setSocket}