import React from "react";

function TypingIndicator({typingUsers}) {
    if(typingUsers.length === 0) return;

    return (
        <div>
            <p>{typingUsers.join(", ")} {typingUsers.length === 1 ? 'is' : 'are'} typing...</p>
        </div>
    )
}

export default TypingIndicator;