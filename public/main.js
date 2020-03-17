// make connection, make a request from backend & keep connection alive
let socket = io();

socket.on('connect', () => {
    console.log('connection established...');
});

socket.on('disconnect', () => { 
    alert('lost connection...');
});