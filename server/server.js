const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const port = process.env.PORT || 3000;
var {generateMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '../public');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
        
    }); 

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat room'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

    
    socket.on('createMessage', (message, callback) => {
        console.log("Create Message", message);
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback('This is from server');
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
    });

});

app.use(express.static(publicPath));

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
    
});

