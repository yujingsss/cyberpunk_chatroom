//import express
const express = require('express');
let app = express();
let server = require("http").createServer(app);
// build a own server to allow accessing the Socket.io library
//create script in html to access this library
let io = require("socket.io")(server);
let port = process.env.PORT || 2000;

server.listen(port, function () {
    console.log(`server listening on localhost:${port}`);
});

io.on("connection", function (client) {
    console.log('a new user connected');

    //initial stage
    client.emit('message', {
        from: 'admin',
        text: 'Welcome, cyberpunker...',
        createdAt: new Date().getTime()
    });

    //everyone except the user get the msg,"someone entered"
    client.broadcast.emit('message', {
        from: 'admin',
        text: 'New existence joined',
        createdAt: new Date().getTime()
    });

    client.on('createMessage', (msg) => {
        console.log('createMessage', msg);
        // broadcast to everyone
        io.emit('message', {
            from: msg.from,
            text: msg.text,
            createdAt: new Date().getTime()
        });

        // //sending to all clients except sender
        // client.broadcast.emit('message', {
        //     from: msg.from,
        //     text: msg.text,
        //     createdAt: new Date().getTime()
        // });
    });

    client.on('disconnect', () => {
        console.log('an user disconnected...');
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