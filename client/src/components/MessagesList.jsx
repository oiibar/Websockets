import React from "react";

function MessagesList({messages}) {
    return (
        <div>
            {
                !messages.length ? null : (
                    <ul>
                        {messages.map((msg, index) => (
                            msg.event === 'disconnection' || msg.event === 'connection'
                                ? <div key={index}>{msg.message}</div>
                                : <div key={index}>{msg.username}: {msg.message}</div>
                        ))}
                    </ul>
                )
            }
        </div>
    )
}

export default MessagesList;