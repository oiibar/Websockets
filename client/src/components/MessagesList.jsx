import React from "react";
import {formatTime} from "../utils/formatTime.js";

function MessagesList({messages}) {
    if(messages.length < 0) return <div>No messages yet</div>;

    return (
        <div>
            {
                <ul>
                    {messages.map((msg, index) => (
                        msg.event === 'disconnection' || msg.event === 'connection'
                            ? <div key={index}>{msg.message} at {formatTime(msg.timestamp)}</div>
                            : <div key={index}>{msg.username}: {msg.message} at {formatTime(msg.timestamp)}</div>
                    ))}
                </ul>
            }
        </div>
    )
}

export default MessagesList;