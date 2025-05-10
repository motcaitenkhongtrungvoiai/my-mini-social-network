let ioInstance = null;
const userSockets = new Map();
const notificationSocket = (io) => {
    ioInstance = io;

    io.on('connection', (socket) => {
        console.log ()

    });
}