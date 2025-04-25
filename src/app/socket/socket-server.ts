import { Server } from 'socket.io';
import http from 'http';

let socketIO: Server | null = null;

export const initializeSocket = (httpServer: http.Server) => {
  try {
    if (!socketIO) {
      socketIO = new Server(httpServer, {
        cors: {
          origin: 'http://localhost:3000',
          methods: ['GET', 'POST'],
          credentials: true,
        },
      });

      socketIO.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on('disconnect', () => {
          console.log(`User disconnected: ${socket.id}`);
        });
      });

      console.log('Socket.IO initialized successfully');
    }
    return socketIO;
  } catch (error) {
    console.error('Error initializing Socket.IO:', error);
    return null;
  }
};

export const getSocketIO = () => {
  if (!socketIO) {
    throw new Error('Socket.IO not initialized');
  }
  return socketIO;
};
