var playerExtensionSocket = {};
var io = null;

async function setUpSocketCommunication(_io) { 
    io = _io;
    io.on('connection', async (socket)=>{
        socket.on('extensionResponse', async (data)=>{
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
