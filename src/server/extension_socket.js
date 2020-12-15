var playerExtensionSocket = {};
var io = null;

async function setUpSocketCommunication(_io) { 
    io = _io;
    io.on('connection', async (socket)=>{
        var game_state = null;
        socket.on('playerWon', (data)=>{
            game_state = data;
            if (game_state){
                io.emit('clientGameOver', game_state);              
            }
        });

        socket.on('extensionResponse', async (data)=>{
            console.log("Extension socket: ", data, socket.id);
            playerExtensionSocket[data.user_id] = socket.id;
        });       
    });   
}

function getPlayerExtensionSockets() {
    return playerExtensionSocket;
}

function getIo() {
    return io;
}


module.exports = {setUpSocketCommunication, getIo, getPlayerExtensionSockets};
