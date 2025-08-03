const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();

const server = http.createServer(app)


//initiate socket.io and attch this to the http server
const io = socketIo(server)


app.use(express.static('public'))

const users = new Set()

io.on("connection", (socket)=>{
    console.log("A user is now connected");
    
    //handle users when they will join the chat
    socket.on('join', (username)=>{
        users.add(username);
        socket.userName = username;


        //brodcast to all clients that a new user is joined
        io.emit('userJoined', username)


        //send the updated user list to all clients
        io.emit('userList', Array.from(users))
    })

    //handle incoming chat messages
    socket.on('chatMessage', (msg)=>{
        //broadcast the received mess to all connected clients
        io.emit("chatMessage", msg)
    })

    //handle user disconnection
    socket.on('disconnect', ()=>{
        console.log("a user is disconnected")
        users.forEach(user => {
            if(user === socket.userName){
                users.delete(user)
                io.emit('userLeft', user)
                io.emit('userList', Array.from(users))
            }
        })
    })

})

server.listen(3000, ()=>{
    console.log("server is running");
    
})