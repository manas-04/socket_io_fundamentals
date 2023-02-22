require("dotenv").config();

const path = require("path");
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const {generateMessage} = require("./utils/message");

const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname,"/../public");

let app = express();
//Creating this server as we want to pass the instance of server to socket.io obj
let httpServer = http.createServer(app);
let io = socketIO(httpServer);

app.use(express.static(publicPath));

io.on("connection",(socket)=>{
    // console.log(socket);
    console.log("A new User Connected");

    // Message sent only to the user who joined
    socket.emit('newMessage',generateMessage("Admin","Welcome to the app!"));

    socket.broadcast.emit('newMessage',generateMessage("Admin","New User Joined!"));    

    socket.on('createMessage',(message,callback)=>{
        console.log("createMessage", message);
        // To emit the message to every user
        io.emit('newMessage',generateMessage(message.from,message.text));
        callback("This is the server.")
        // This will emit the event for everyone else except the person who created createMessage event
        // socket.broadcast.emit('newMessage',{
        //     from:message.from,
        //     text:message.text,
        //     createdAt:new Date().getTime,
        // });    
    });

    
    socket.on("disconnect",function (){
        console.log("A User Disconnected");
    });
});

httpServer.listen(PORT,function (){
    console.log(`Server running on Port : ${PORT}`);
});