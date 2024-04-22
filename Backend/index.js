const app = require('express');
const httpServer = require('http').createServer(app);

const io = require('socket.io')(httpServer, {
    cors: true,
    origins: ["*"]  
});

const server = httpServer;

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const rooms = {};

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('drawing', (data) => {
        socket.broadcast.emit('drawing', data);
    })

    socket.on('update-canvas', (data) => { 
        const {roomId, canvaData} = data;
        rooms[roomId] = canvaData;
        socket.emit('update-cavas', rooms[roomId]);
    });

    socket.on('create-room', (roomId) => {
        rooms[roomId] = [];
        console.log('created room', roomId);
    });

    socket.on('join-room', (roomId) => {
        if(!rooms[roomId]) {
            console.log('room does not exist');
            socket.emit('join-room', -1)
            return ;
        }
        socket.emit('join-room', rooms[roomId]);
    });
});


