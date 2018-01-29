const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const port = process.env.PORT || 3000;
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');

const publicPath = path.join(__dirname, '../public');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
        
    }); 

    socket.on('join', (params, callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)){
            callback('Display name and room name are mandatory');
        }
        socket.join(params.room);
        //socket.leave(params.room);
        //io.to(params.room).emit;
        //socket.broadcast.to(params.room).emit;
        
        socket.emit('newMessage', generateMessage('Admin', `Welcome to chat room ${params.room}`));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined the room`));
        callback();
    });
    
    socket.on('createMessage', (message, callback) => {
        console.log("Create Message", message);
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage(coords.from, coords.latitude, coords.longitude));
    }); 

});

app.use(express.static(publicPath));

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
    
});

