import io from 'socket.io-client';

var socket = io.connect('http://localhost:5000');

export default socket;

