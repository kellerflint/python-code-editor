import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import { setupRoomSocket } from './sockets/roomSocket.js';

if (process.env.NODE_ENV === 'development') dotenv.config({path: '.env.development'});

const app = express();
const server = http.createServer(app);
const port = process.env.DEFAULT_PORT;

setupRoomSocket(server);

app.get('/ping', (req, res) => {
  res.send('pong');
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


/*

If we need the API aspect later, can do something like this:

// middlewares/cors.js
import cors from 'cors';

export const corsMiddleware = cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

// routes/api.js
import express from 'express';

const router = express.Router();

router.get('/data', (req, res) => {
  const userId = req.user.sub;
  res.json({ userId });
});

export default router;

*/
