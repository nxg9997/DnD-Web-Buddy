//let http = require('http');
//let io = require('socket.io')(http);

const buildSocket = (server) => {
    let io = require('socket.io')(server);

    io.on('connection', (socket) => {
        console.log('a user connected');
        socket.on('disconnect', () => {
            console.log('a user disconnected');
        });

        socket.on('stat update', (msg) => {
            console.log(msg);
        });
    });

    

    return io;
}


module.exports.io = buildSocket;