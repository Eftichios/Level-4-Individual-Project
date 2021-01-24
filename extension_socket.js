var playerExtensionSocket = {};
var io = null;

// on connection, the server communicates with all sockets
// the responses are only from extension sockets
// we use a datastructure to map user ids to extension sockets
async function setUpSocketCommunication(_io) { 
    io = _io;
    io.on('connection', async (socket)=>{
        socket.on('extensionResponse', async (data)=>{
            if (data.user_id){
                // if foundUser is true, that means the details entered
                // on the extension are correct
                if (data.foundUser){
                    playerExtensionSocket[data.user_id] = socket.id;
                }else if (playerExtensionSocket[data.user_id]){
                    // else if the user gave the wrong details
                    // remove their extension map from the player extensions
                    // handles cases where players might have two accounts and one extension
                    delete playerExtensionSocket[data.user_id]
                }
                
            }
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
