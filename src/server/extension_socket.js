const { setSocket } = require('./express/routes/game')


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

        var game_state = null;
        socket.on('playerWon', (data)=>{
            game_state = data;
            if (game_state){
                io.emit('clientGameOver', game_state);              
            }
        })
        

        

        await setSocket(socket);
    });

    return io;
    
}


module.exports = {setUpSocketCommunication};
