import io from 'socket.io-client';

// we define the socket here so that we can share it between components
if (socket===undefined){
    var socket = io({transports: ['websocket'], reconnection: false});
}

console.log(socket.id);


export default socket;

