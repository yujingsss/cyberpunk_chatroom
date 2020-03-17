//import express
const express = require('express');
let app = express();
let server = require("http").createServer(app);
// build a own server to allow accessing the Socket.io library
//create script in html to access this library
let io = require("socket.io")(server);
let port = process.env.PORT || 2000;

server.listen(port, () => {
    console.log(`server listening on localhost:${port}`);
});

io.on("connection", (client) => {
    console.log('a new user connected');
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