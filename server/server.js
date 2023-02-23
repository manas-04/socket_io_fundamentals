//io.emit is to everybody including you in the group
//socket.emit is to a particular socket 
//socket.broadcast.emit to all the users except you
//socket.join to join a room 
//socket.broadcast.to(roomName).emit to emit a message to all users except you in a room

require("dotenv").config();

const path = require("path");
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const {generateMessage, generateLocationMessage} = require("./utils/message");
const { isRealString } = require("./utils/stringHelpers");
const {Users} = require("./utils/user");

const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname,"/../public");

let app = express();
//Creating this server as we want to pass the instance of server to socket.io obj
let httpServer = http.createServer(app);
let io = socketIO(httpServer);
let users = new Users();

app.use(express.static(publicPath));

io.on("connection",(socket)=>{
    // console.log(socket);
    // console.log("A new User Connected"); 

    socket.on('join',(params,callback)=>{
        if(!isRealString(params.name) || !isRealString(params.room)){
            return callback("Name and room are required.");
        }else{
            socket.join(params.room);
            
            //So that the user can be removed from any other existing group
            users.removeUser(socket.id);

            //Adding the user to new group
            users.addUser(socket.id,params.room,params.name);

            //To broadcast the latest user list of that group to that group
            io.to(params.room).emit('updatedUserList',users.getUserList(params.room));

            // Message sent only to the user who joined
            socket.emit('newMessage',generateMessage("Admin",`Welcome to the ${params.room}!`));

            //Message sent to all other users except the user who joined
            socket.broadcast.to(params.room).emit('newMessage',generateMessage("Admin","New User Joined!"));   
            callback();
        }
    });

    socket.on('createMessage',(message)=>{
        // console.log("createMessage", message);
        let user = users.getUser(socket.id);
        // console.log(user.room);

        if(user && isRealString(message.text)){
            io.to(user.room).emit('newMessage',generateMessage(user.name,message.text));
        }
        // To emit the message to every user
        // io.emit('newMessage',generateMessage(message.from,message.text));

        // callback("This is the server.")
        
        // This will emit the event for everyone else except the person who created createMessage event
        // socket.broadcast.emit('newMessage',{
        //     from:message.from,
        //     text:message.text,
        //     createdAt:new Date().getTime,
        // });    
    });

    socket.on('createLocationMessage',(coords)=>{
        let user = users.getUser(socket.id);

        if(user && coords.lat && coords.long){
            io.to(user.room).emit('newLocationMessage',generateMessage(user.name,coords.lat,coords.long));
        }
        // io.emit('newLocationMessage',
        // generateLocationMessage('Admin',coords.lat,coords.long,
        // ));
    });

    socket.on("disconnect",function (){
        let user = users.removeUser(socket.id);
        //Removing the user from the updated List
        io.to(user.room).emit('updatedUserList',users.getUserList(user.room));

        //Informing everyone in the room that a particular person has left
        io.to(user.room).emit('newMessage',generateMessage("Admin",`${user.name} has left ${user.room} chat room.`));

        // console.log("A User Disconnected");
    });
});

httpServer.listen(PORT,function (){
    console.log(`Server running on Port : ${PORT}`);
});