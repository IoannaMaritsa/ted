import React, { useState, useEffect, useRef } from 'react';
import '../css/epag-messages.css';
import { formatTime } from '../utils/timeUtils';
import { useAppContext } from '../context/appContext';
import getImageUrl from '../hooks/getImageUrl';

const MessageContainer = ({ contact, messages = [], onSendMessage }) => {
    const [message, setMessage] = useState('');
    const scrollableDivRef = useRef(null); // Ref for scrolling
    const { user } = useAppContext();

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
            e.preventDefault();
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
                <img src={getImageUrl(contact.profilepic, "profilepics")} alt="Profile" className="header-profile-pic" />
                <span className="header-contact-name">{contact.name}</span>
            </div>
            <div ref={scrollableDivRef} className="messages">
                {messages.length === 0 ? (
                    <p>No messages yet.</p>
                ) : (
                    messages.map((msg, index) => {
                        const isFromUser = msg.sender_email === user.email;
                        return (
                            <div
                                key={index}
                                className={`message ${isFromUser ? 'user' : 'contact2'}`}
                            >
                     
                                <div className="message-content">
                                    <span className="timestamp"> {formatTime(new Date(msg.created_at))}</span>
                                    <span className="msg-text">{msg.text || ''}</span>
                                </div>
                            </div>
                        );
                    })
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
