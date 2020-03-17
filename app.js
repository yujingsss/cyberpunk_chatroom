//import express
const express = require('express');
let app = express();
let server = require("http").createServer(app);
const port = process.env.PORT || 2000;

server.listen(port, () => {
    console.log(`server listening on localhost:${port}`);
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