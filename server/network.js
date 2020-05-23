//let http = require('http');
//let io = require('socket.io')(http);
let IO;

let roomDict = {};
let roomState = {};

const buildSocket = (server) => {
    let io = require('socket.io')(server);

    io.on('connection', (socket) => {
        console.log('a user connected');

        roomDict[socket.id] = socket.id;

        socket.on('disconnect', () => {
            console.log('a user disconnected');
            roomDict[socket.id] = null;
        });

        socket.on('stat update', (msg) => {
            console.log(msg);

            //io.emit('stat update', msg);
            socket.to(roomDict[socket.id]).emit('stat update', msg);
            roomState[roomDict[socket.id]] = msg;
        });

        socket.on('room change', (msg) => {
            socket.join(msg);
            roomDict[socket.id] = msg;
            if(roomState[msg]){
                io.to(msg).emit('stat update', roomState[msg]);
            }
            else roomState[msg] = null;
        });
    });

    IO = io;

    return io;
};

module.exports.io = buildSocket;