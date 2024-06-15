import WebSocketServer from 'ws';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

const rooms = new Map();

export const setupRoomSocket = (server) => {

  const wss = new WebSocketServer({ noServer: true });

/*

    verifyClient: (info, cb) => {
      info.origin === process.env.FRONTEND_APP_URL 
      ? cb(true)
      : cb(false, 403, 'Forbidden');
    }
*/

  wss.on('connection', (ws) => {

    let wsProvider;

    ws.on('message', (message) => {
      const data = JSON.parse(message);

      switch (data.action) {
        case 'createRoom':
          const roomId = Math.random().toString(36).substring(7);
          rooms.set(roomId, new Y.Doc());
          ws.send(JSON.stringify({ action: 'roomCreated', roomId }));
          break;
        case 'joinRoom':
          roomId = data.roomId;
          if (rooms.has(roomId)) {
            doc = rooms.get(roomId);
            wsProvider = new WebsocketProvider(roomId, doc, { ws });
            ws.send(JSON.stringify({ action: 'roomJoined', roomId }));
          } else {
            ws.send(JSON.stringify({ action: 'roomNotFound', roomId }));
          }
          break;
          default:
            console.log('Invalid action');
            ws.send(JSON.stringify({ action: 'invalidAction' }));
        }
    });

    ws.on('close', () => {
      if (wsProvider) {
        wsProvider.destroy();
      }
    });
  });
};