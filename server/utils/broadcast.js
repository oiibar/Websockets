export function broadcast(wss, msg, sender) {
    wss.clients.forEach(client => {
        if(client.readyState === WebSocket.OPEN) {
            if(client.bufferedAmount > 1024 * 1024) {
                console.warn('Client is too slow, skipping message');
                client.terminate();
            }
            client.send(JSON.stringify(msg));
        }
    })
}