import io from 'socket.io-client';

// we define the socket here so that we can share it between components
if (socket===undefined){
    var socket = io.connect('https://ad-hunter.herokuapp.com/');
}

export default socket;

