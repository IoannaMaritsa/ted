import React, { useState } from 'react';
import '../css/epag-messages.css'; // Make sure to create this CSS file

const MessageContainer = ({ contact, messages, onSendMessage }) => {

    const [message, setMessage] = useState('');

    const handleSendClick = () => {
        if (message.trim()) {
            onSendMessage(message.trim()); // Call the passed function
            setMessage('');
        }
    };

    return (
        <div className="message-container">
            <div className="message-header">
                <img src={contact.profilePic} alt="Profile" className="header-profile-pic" />
                <span className="header-contact-name">{contact.name}</span>
            </div>
            <div className="messages">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message ${msg.fromUser ? 'user' : 'contact'}`}
                    >
                        {!msg.fromUser && (
                            <img src={contact.profilePic} alt="Profile" className="message-pic" />
                        )}
                        <div className="message-content">
                            <span className="timestamp">{msg.timestamp}</span>
                            <span className="msg-text">{msg.text}</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="message-footer">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="message-input"
                />
                <img
                    src="/send-icon.png"
                    alt="Send"
                    className="send-icon"
                    onClick={handleSendClick}
                />
            </div>
        </div>
    );
};

export default MessageContainer;
