async function userIsLoggedIn(){
    return true;
}


async function setUpSocketCommunication(io) { 
    io.on('connection', async (socket)=>{
        
        var user_logged_in = await userIsLoggedIn();
        if (user_logged_in){
            socket.emit('loggedIn', true)
        } else {
            socket.emit('notloggedIn', false)
        }

    });
    
}


module.exports = {setUpSocketCommunication};
