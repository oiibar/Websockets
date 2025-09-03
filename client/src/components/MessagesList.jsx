import React from "react";
import {formatTimestamp} from '../utils/formatTimestamp.js'

function MessagesList({messages}) {
    return (
        <div>
            {
                !messages.length ? null : (
                    <ul>
                        {messages.map((msg, index) => (
                            msg.event === 'disconnection' || msg.event === 'connection'
                                ? <div key={index}><i>{formatTimestamp(msg.timestamp)}</i> {msg.message}</div>
                                : <div key={index}>{msg.username} <i>{formatTimestamp(msg.timestamp)}</i>: {msg.message}</div>
                        ))}
                    </ul>
                )
            }
        </div>
    )
}

export default MessagesList;