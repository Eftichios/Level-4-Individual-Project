var playerExtensionSocket = {};
var io = null;

// on connection, the server communicates with all sockets
// the responses are only from extension sockets
// we use a datastructure to map user ids to extension sockets
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
