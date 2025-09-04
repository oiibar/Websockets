import { WebSocketServer } from 'ws'
import { broadcast } from "./utils/broadcast.js";
import { heartbeat } from "./utils/heartbeat.js";

const usersList = new Map();

export function createWSServer(port = 8080) {
    const wss = new WebSocketServer({ port }, () => {
        console.log('Websocket server running on port', port);
    });

    wss.on('connection', function connection(ws) {
        ws.isAlive = true;
        ws.username = null;

        ws.on('pong', heartbeat);

        ws.on('message', (message) => {
            try {
                const msg = JSON.parse(message.toString());

                switch (msg.event) {
                    case 'connection':
                        ws.username = msg.username;
                        usersList.set(msg.username, 'online');

                        broadcast(wss, msg, ws);
                        broadcast(wss, {
                            event: 'users_list',
                            users: Array.from(usersList, ([username, status]) => ({ username, status }))
                        }, ws);
                        break;

                    case 'message':
                        usersList.set(msg.username, 'online'); // keep them online
                        broadcast(wss, msg, ws);
                        break;

                    case 'disconnection':
                        usersList.set(msg.username, 'offline');
                        broadcast(wss, msg, ws);
                        broadcast(wss, {
                            event: 'users_list',
                            users: Array.from(usersList, ([username, status]) => ({ username, status }))
                        }, ws);
                        break;

                    case 'typing':
                    case 'stop_typing':
                        broadcast(wss, msg, ws);
                        break;
                }
            } catch (err) {
                console.error('Invalid message received:', err);
            }
        });

        ws.on('close', () => {
            if (ws.username) {
                usersList.set(ws.username, 'offline');

                broadcast(wss, {
                    event: 'users_list',
                    users: Array.from(usersList, ([username, status]) => ({ username, status }))
                }, ws);
            }
        });

        ws.on('error', (err) => {
            console.error('WebSocket error:', err);
        });
    });

    return wss;
}
