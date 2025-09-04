import React from 'react'
import TypingIndicator from "./components/TypingIndicator.jsx";
import MessagesList from "./components/MessagesList.jsx";
import MessageInput from "./components/MessageInput.jsx";
import {useWebSocket} from "./hooks/useWebSocket.js";
import UserList from "./components/UserList.jsx";

function App() {
    const [value, setValue] = React.useState('');
    const [username, setUsername] = React.useState('')
    const { connect, disconnect, sendMessage, sendTyping, connected, messages, typingUsers, users } = useWebSocket(username);

    if(!connected) {
        return (
            <div>
                <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} />
                <button onClick={connect}>Connect</button>
            </div>
        )
    }

    return (
        <div>
            <UserList users={users} />
            <MessageInput value={value} setValue={setValue} sendMessage={sendMessage} sendTyping={sendTyping} />
            <button onClick={disconnect}>Leave</button>
            <MessagesList messages={messages} />
            <TypingIndicator typingUsers={typingUsers} />
        </div>
    )
}

export default App
