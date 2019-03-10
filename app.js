// const express = require('express');
// const app = express();
// const path = require('path');
// const router = express.Router();

// router.get('/',function(req,res){
//   res.sendFile(path.join(__dirname+'/index.html'));
// });

// const app = require('express')();
// const path = require('path');
// const express = require('express');
// const router = express.Router();
// const server = require('http').createServer(app);
// const io = require('socket.io')(server);
// io.on('connection', () => { /* … */ });
// server.listen(3000);

// router.get('/',function(req,res){
//   res.sendFile(path.join(__dirname+'/index.html'));
// });

// //add the router
// app.use('/', router);
// //app.listen(process.env.port || 3000);
// app.use(express.static(path.resolve('./public')));
// console.log('Running at Port 3000');

const express = require("express");
var app = require("express")();
const path = require("path");
var http = require("http").Server(app);
var io = require("socket.io")(http);
var txtomp3 = require("text-to-mp3");
app.use(express.static(path.resolve("./public")));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});
io.on("connection", function(socket) {
  socket.on("chat message", function(msg) {
    console.log("message: " + msg);
    txtomp3
      .saveMP3(
        "If white women are going to consume turmeric, how do I make sure brown farmers make as much money off of it as possible?",
        "FileName"
      )
      .then(function(absoluteFilePath) {
        console.log("File saved :", absoluteFilePath); //"File saved : /home/enrico/WebstormProjects/textToMp3/FileName.mp3"
      })
      .catch(function(err) {
        console.log("Error", err);
      });
  });
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});
