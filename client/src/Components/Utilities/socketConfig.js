import io from 'socket.io-client';

// we define the socket here so that we can share it between components
var socket = io({transports: ['websocket']});
console.log(socket.id);


export default socket;

