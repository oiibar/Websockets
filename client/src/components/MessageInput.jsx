import React from "react";

function MessageInput({value, setValue, sendMessage, sendTyping}) {
    return (
        <div>
            <input
                type='text'
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    sendTyping(e.target.value)
                }} />
            <button onClick={(e) => {
                sendMessage(value);
                setValue('');
            }}>Submit</button>
        </div>
    )
}

export default MessageInput;