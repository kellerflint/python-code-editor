import socketIO from 'socket.io';
import { createRoom, getRoom, updateRoomCode, updateRoomOutput } from './roomService';

export const setupRoomSocket = (server) => {

  const io = socketIO(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {

    socket.on('createRoom', (data) => {
      socket.leaveAll();
      const newRoomId = createRoom(data);
      socket.join(newRoomId);
      socket.emit('roomCreated', newRoomId);
    });

    socket.on('joinRoom', (roomId) => {
      if (!getRoom(roomId)) {
        console.log(`joinRoom failed: Room ${roomId} has not been created`);
        return;
      }

      socket.leaveAll();
      socket.join(roomId);
      socket.emit('roomJoined', { roomId, "data": getRoom(roomId) });
    });

    socket.on('codeChange', (data) => {
      const { roomId, code } = data;

      if (!getRoom(roomId)) {
        console.log(`codeChange failed: Room ${roomId} has not been created`);
        return;
      }
      
      updateRoomCode(roomId, code);
      socket.to(roomId).emit('codeUpdate', code);
    });

    socket.on('outputChange', (data) => {
      const { roomId, output } = data;
      
      if (getRoom(roomId)) {
        console.log(`outputChange failed: Room ${roomId} has not been created`);
        return;
      }

      updateRoomOutput(roomId, output);
      socket.to(roomId).emit('outputUpdate', output);
    });
  });
};