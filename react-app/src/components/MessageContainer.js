import React, { useState, useEffect, useRef } from 'react';
import '../css/epag-messages.css'; 
import { formatTime } from '../utils/timeUtils';

const MessageContainer = ({ contact, messages = [], onSendMessage }) => {
    const [message, setMessage] = useState('');
    const scrollableDivRef = useRef(null); // Ref for scrolling

    // Handle sending a message
    const handleSendClick = () => {
        if (message.trim()) { // Don't send the message if it's only whitespace
            onSendMessage(message.trim()); 
            setMessage(''); // Clear input field
        }
    };

    // Handle keydown event for sending message on Enter key
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent the default newline behavior
            handleSendClick();
        }
    };

    // Scroll to the bottom of the messages container when messages change
    useEffect(() => {
        const div = scrollableDivRef.current;
        if (div) {
            div.scrollTop = div.scrollHeight;
        }
    }, [messages, message]);


     return (
        <div className="message-container">
            <div className="message-header">
                <img src={contact.profilePic} alt="Profile" className="header-profile-pic" />
                <span className="header-contact-name">{contact.name}</span>
            </div>
            <div  ref={scrollableDivRef} className="messages">
                {messages.length === 0 ? (
                    <p>No messages yet.</p>
                ) : (
                    messages.map((msg, index) => (
                        <div
                 
                            key={index}
                            className={`message ${msg.fromUser ? 'user' : 'contact'}`}
                        >
                            {!msg.fromUser && (
                                <img
                                    src={contact?.profilePic || '/default-avatar.jpeg'}
                                    alt="Profile"
                                    className="message-pic"
                                />
                            )}
                            <div className="message-content">
                                <span className="timestamp">{formatTime(msg.timestamp)}</span> 
                                <span className="msg-text">{msg.text || ''}</span>
                            </div>
                        </div>
                    ))
                )}

                
            </div>
            <div className="message-footer">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="message-input"
                    onKeyDown={handleKeyDown}
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
