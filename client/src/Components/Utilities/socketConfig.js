import io from 'socket.io-client';

// we define the socket here so that we can share it between components
if (socket===undefined){
    var socket = io();
}

console.log(socket);


export default socket;
