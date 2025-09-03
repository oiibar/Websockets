import React from "react";

function TypingIndicator({typingUsers}) {
    return (
        <div>
            {
                typingUsers.length > 0 &&
                <p>{typingUsers.join(", ")} {typingUsers.length === 1 ? 'is' : 'are'} typing...</p>
            }
        </div>
    )
}

export default TypingIndicator;