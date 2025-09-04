import { useRef, useState } from "react";

export function useWebSocket(username) {
    const ws = useRef(null);
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [typingUsers, setTypingUsers] = useState([]);
    const [connected, setConnected] = useState(false);
    const timeoutRef = useRef(null);
    const lastSentRef = useRef(0);

    function connect() {
        ws.current = new WebSocket('ws://localhost:8080');

        ws.current.onopen = () => {
            setConnected(true);
            ws.current.send(JSON.stringify({
                id: Date.now(),
                timestamp: Date.now(),
                username,
                message: `${username} connected`,
                event: 'connection'
            }));
        };

        ws.current.onclose = () => {
            setConnected(false);
            setTypingUsers([]);
        };

        ws.current.onmessage = (e) => {
            const msg = JSON.parse(e.data);
            switch (msg.event) {
                case "typing":
                    setTypingUsers(prev => [...new Set([...prev, msg.username])]);
                    break;
                case "stop_typing":
                    setTypingUsers(prev => prev.filter(u => u !== msg.username));
                    break;
                case 'users_list':
                    // msg.users is already normalized into { username, status }
                    setUsers(msg.users);
                    break;
                default:
                    setMessages(prev => [msg, ...prev]);
            }
        };
    }

    function disconnect() {
        setConnected(false);
        ws.current?.send(JSON.stringify({
            id: Date.now(),
            timestamp: Date.now(),
            username,
            message: `${username} disconnected`,
            event: 'disconnection'
        }));
        ws.current?.close();
    }

    function sendMessage(text) {
        if (Date.now() - lastSentRef.current < 2000) {
            return;
        }
        lastSentRef.current = Date.now();

        ws.current.send(JSON.stringify({
            id: Date.now(),
            timestamp: Date.now(),
            username,
            message: text,
            event: 'message',
        }));
    }

    function sendTyping() {
        ws.current?.send(JSON.stringify({
            id: Date.now(),
            username,
            event: 'typing',
        }));

        clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            ws.current.send(JSON.stringify({
                id: Date.now(),
                username,
                event: 'stop_typing',
            }));
        }, 2000);
    }

    return { connect, disconnect, sendMessage, sendTyping, connected, messages, typingUsers, users };
}
