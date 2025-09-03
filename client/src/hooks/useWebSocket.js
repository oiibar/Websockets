import {useRef, useState} from "react";

export function useWebSocket(username) {
    const ws = useRef(null)
    const [messages, setMessages] = useState([]);
    const [typingUsers, setTypingUsers] = useState([]);
    const [connected, setConnected] = useState(false);
    const timeoutRef = useRef(null);
    const lastSentRef = useRef(0);
    const [users, setUsers] = useState([]);

    function connect() {
        ws.current = new WebSocket('ws://localhost:8080')

        ws.current.onopen = () => {
            setConnected(true);
            ws.current.send(JSON.stringify({
                timestamp: Date.now(),
                username,
                message: `${username} connected`,
                event: 'connection'
            }));
        }

        ws.current.onclose = () => {
            setConnected(false);
            setTypingUsers([]);
        }

        ws.current.onmessage = (e) => {
            const msg = JSON.parse(e.data)
            switch (msg.event) {
                case "typing":
                    setTypingUsers(prev => [...new Set([...prev, msg.username])]);
                    break;
                case "stop_typing":
                    setTypingUsers(prev => prev.filter(u => u !== msg.username));
                    break;
                case "user_states":
                    setUsers(prev => [...prev, msg.username]);
                    break;
                default:
                    setMessages(prev => [msg, ...prev]);
            }
        }
    }

    function disconnect() {
        setConnected(false);
        ws.current?.send(JSON.stringify({
            timestamp: Date.now(),
            username,
            message: `${username} disconnected`,
            event: 'disconnection'
        }))
        ws.current?.close()
    }

    function sendMessage(text) {
        const now = Date.now();
        if(Date.now() - lastSentRef.current < 2000) {
            return;
        }
        lastSentRef.current = now;

        ws.current.send(JSON.stringify({
            timestamp: now,
            username,
            message: text,
            event: 'message',
        }))
    }

    function sendTyping(e) {
        ws.current?.send(JSON.stringify({
            username,
            event: 'typing',
        }))

        clearTimeout(timeoutRef.current)

        timeoutRef.current = setTimeout(() => {
            ws.current.send(JSON.stringify({
                username,
                event: 'stop_typing',
            }))
        }, 2000)
    }

    return { connect, disconnect, sendMessage, sendTyping, connected, messages, typingUsers, users };
}