//import express
const express = require('express');
let app = express();
let server = require("http").createServer(app);
// build a own server to allow accessing the Socket.io library
//create script in html to access this library
let io = require("socket.io")(server);
let port = process.env.PORT || 2000;

let clients = [];

let adminHost = "Tyrell Corporation";
const moment = require('moment');

let generateMessage = (from, text) => {
    return {
        from,
        text,
        createdAt: moment().valueOf()
    };
};
let generateLocationMessage = (from, lat, long) => {
    return {
        from,
        url: `https://www.google.com/maps?q=${lat},${long}`,
        createdAt: moment().valueOf()
    }
};

server.listen(port, function () {
    console.log(`server listening on localhost:${port}`);
});

io.on("connection", function (client) {
    console.log('connected');
    let _id;
    //initial stage
    client.emit('introgreeting', generateMessage(adminHost, 'Welcome...')
    // {   from: 'admin',
    //     text: 'Welcome, cyberpunker...',
    //     createdAt: new Date().getTime()}
    );

    //everyone except the user get the msg,"someone entered"
    //sending to all clients except sender
    client.broadcast.emit('introgreeting', generateMessage('Broadcast', 'New replicant online'));

    client.on('createMessage', (msg, callback) => {
        console.log('createMessage', msg);
        // broadcast to everyone including sender
        io.emit('newMessage', generateMessage(msg.from, msg.text));
        callback('this is the server:');
    });

    client.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage(coords.from, coords.lat, coords.long));
    });

    client.on('createName', (msg) => {
        _id = client.id;
        console.log('createName', msg);
        // clients.splice(0 , 0, `\n${msg.text}`);
        clients.push(msg.text);
        console.log(`user ${msg.text} entered`);
        console.log('all users: ' + clients);
        io.emit('introgreeting', generateMessage('Broadcast', `${msg.text} entered...`));
        client.emit('newMessage', generateMessage(adminHost, `Welcome, replicant #${msg.text}`));
        client.broadcast.emit('newMessage', generateMessage('Broadcast', `${msg.text} joined chat...`));
        io.emit('availableusers', clients);
        _id = msg.text;
    });

    client.on('disconnect', () => {
        console.log(`an user ${_id} disconnected...`);
        client.broadcast.emit('userquit', _id);
        console.log(`${_id} quit`);
        client.broadcast.emit('introgreeting', generateMessage('Broadcast', 'A replicant left...'));
        client.broadcast.emit('newMessage', generateMessage('Broadcast', `${_id} left...`));
        for (let i = 0; i< clients.length; i++) {
            if (_id == clients[i]) {
                // console.log("T");
                clients.splice(i,1);
                // console.log(clients);
            }
        }
        client.broadcast.emit('availableusers', clients);
    });
});

app.use(express.static(__dirname + "/public"));
//https://expressjs.com/en/starter/static-files.html
app.get('/', function (req, res) {
    console.log(`serving ${__dirname} /index.html`);
    res.sendFile(__dirname + "/index.html");
});
//https://nodejs.org/docs/latest/api/modules.html#modules_dirname
// __dirname:The directory name of the current module. This is the same as the path.dirname() of the __filename.
// Example: running node example.js from /Users/mjr
// console.log(__dirname);
// // Prints: /Users/mjr
// console.log(path.dirname(__filename));
// // Prints: /Users/mjr