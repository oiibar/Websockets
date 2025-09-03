import {WebSocketServer} from 'ws'
import {broadcast} from "./utils/broadcast.js";
import {heartbeat} from "./utils/heartbeat.js";

export function createWSServer(port = 8080) {
    const wss = new WebSocketServer({port}, () => {
        console.log('Websocket server running on port', port);
    })

    wss.on('connection', function connection(ws) {
        ws.isAlive = true;

        ws.on('pong', heartbeat);

        ws.on('message', (message)=> {
            try {
                ws.bufferedAmount
                const msg = JSON.parse(message.toString())
                switch(msg.event) {
                    case 'message':
                    case 'connection':
                    case 'disconnection':
                    case 'typing':
                    case 'stop_typing':
                        broadcast(wss, msg, ws)
                        break;
                }
            } catch (err) {
                console.error('Invalid message received:', err);
            }
        })

        const interval = setInterval(() => {
            wss.clients.forEach((ws) => {
                if (ws.isAlive === false) {
                    console.log('Terminating dead client');
                    return ws.terminate();
                }

                ws.isAlive = false;
                ws.ping();
            });
        }, 10000)

        ws.on('error', (err) => {
            console.error('WebSocket error:', err);
        });

        ws.on('close', (code, reason) => {
            clearInterval(interval)
            console.log(`Client disconnected. Code: ${code}, Reason: ${reason.toString()}`);
        });
    })

    return wss;
}