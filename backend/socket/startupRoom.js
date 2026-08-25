// Mavjud io.on('connection', (socket) => { ... }) handleringiz ichida chaqiring:
//   const { registerStartupRoomHandlers } = require('./socket/startupRoom');
//   registerStartupRoomHandlers(socket);
const registerStartupRoomHandlers = (socket) => {
  socket.on('joinStartupRoom', (startupId) => {
    if (startupId) socket.join(`startup:${startupId}`);
  });
  socket.on('leaveStartupRoom', (startupId) => {
    if (startupId) socket.leave(`startup:${startupId}`);
  });
};

module.exports = { registerStartupRoomHandlers };
