// make connection, make a request from backend & keep connection alive
let socket = io();

socket.on('connect', function () {
    console.log('connection established...');

    // socket.emit('createMessage', {
    //     from: 'client',
    //     text: 'server'
    // });
});

socket.on('message', function (msg) {
    // console.log(`${msg.from}: ${msg.text} at ${msg.createdAt}`);
    console.log('message', msg);
});

//socket.on - listening an event
socket.on('disconnect', function () {
    console.log('lost connection...');
});


