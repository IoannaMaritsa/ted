import React, { useState, useEffect, useMemo } from "react";
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainBottom from '../components/MainBottom';
import '../css/epag-messages.css';
import Breadcrumbs from "../components/Breadcrumbs";
import MessageContainer from "../components/MessageContainer";
import { parseRelativeTime, formatRelativeTime, formatTime } from "../utils/timeUtils";

export default function Epag_messages() {

    const [messages, setMessages] = useState({
        1: [ // John's messages
            { fromUser: false, text: 'Hi!', timestamp: new Date('2024-08-24T10:00:00') },
            { fromUser: true, text: 'Hello!', timestamp: new Date('2024-08-24T10:05:00') },
            { fromUser: true, text: 'Whats up?', timestamp: new Date('2024-08-24T10:05:00') },
            { fromUser: false, text: 'Lorem ipsum odor amet, consectetuer adipiscing elit. Eros ultrices nec nunc suspendisse inceptos platea viverra. Facilisi placerat viverra, urna donec mauris duis quis vel. Iaculis nulla finibus malesuada scelerisque feugiat ex! Inceptos sociosqu dictumst rutrum facilisis integer; pretium mollis duis. Sed in montes amet hac himenaeos orci maecenas eros.', timestamp: new Date('2024-08-24T10:10:00') },
        ],
        2: [ // Jane's messages
            { fromUser: false, text: 'Good morning!', timestamp: new Date('2024-08-24T09:00:00') },
            { fromUser: true, text: 'Good morning!', timestamp: new Date('2024-08-24T09:10:00') }
        ],
        3: [ // Alice's messages
            { fromUser: true, text: 'Are you available?', timestamp: new Date('2024-08-24T08:00:00') },
            { fromUser: false, text: 'Yes, I am!', timestamp: new Date('2024-08-24T08:05:00') }
        ]
    });
    

    const [contacts, setContacts] = useState([
        {
            id: 1,
            name: 'John Doe',
            profilePic: '/default-avatar.jpeg',
            lastMessage: '',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        },
        {
            id: 2,
            name: 'Jane Smith',
            profilePic: '/default-avatar.jpeg',
            lastMessage: '',
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        },
        {
            id: 3,
            name: 'Alice Johnson',
            profilePic: '/default-avatar.jpeg',
            lastMessage: '',
            timestamp: new Date(0), // 5 minutes ago
        },

    ]);
    




    const sortedContacts = useMemo(() => {
        return [...contacts].sort(
            (a, b) => b.timestamp - a.timestamp
        );
    }, [contacts]);

    const [selectedContact, setSelectedContact] = useState(null);

    // Update selected contact when sorted contacts change
    useEffect(() => {

        if (sortedContacts.length > 0) {
            setSelectedContact(sortedContacts[0]); // Set the first contact from the sorted list
        }
    }, [sortedContacts]);


    // Update contacts based on new messages
    useEffect(() => {
        setContacts(prevContacts =>
            prevContacts.map(c => {
                const contactMessages = messages[c.id] || [];
                const latestMessage = contactMessages[contactMessages.length - 1]; // Get the most recent message
                console.log("ayo", latestMessage.timestamp, c.name);
                if (latestMessage) {
                    return {
                        ...c,
                        lastMessage: latestMessage.text,
                        timestamp: latestMessage.timestamp, // Update contact's timestamp
                    };
                }
                return {
                    ...c,
                    lastMessage: '',
                    timestamp: new Date(0), // Display an empty string for contacts with no messages
                };
            })
        );
    }, [messages]);

    // Change the selected contact on contact click
    const handleContactClick = (contact) => {
        setSelectedContact(contact);
    };


    // Handle message creation
    const handleNewMessage = (text) => {
        if (!selectedContact) return;

        const now = new Date(); // Get the current date and time
        const newMessage = { fromUser: true, text, timestamp: now }; // Store timestamp as a Date object

        // Update messages with the new message
        setMessages(prevMessages => {
            const updatedMessages = { ...prevMessages };
            if (updatedMessages[selectedContact.id]) {
                updatedMessages[selectedContact.id].push(newMessage);
            } else {
                updatedMessages[selectedContact.id] = [newMessage];
            }
            return updatedMessages;
        });

        // Update contacts with the latest message
        setContacts(prevContacts =>
            prevContacts.map(c =>
                c.id === selectedContact.id
                    ? {
                        ...c,
                        lastMessage: text,
                        timestamp: now, // Store timestamp as a Date object
                    }
                    : c
            )
        );
    };




    return (
        <div>
            <Header variant="professional" />
            <Breadcrumbs />
            <div className="messaging-page">
                <header className="mess-header">
                    <h1>Συζητήσεις</h1>
                </header>
                <main className="main-content-mess">
                    <div className="sidebar">
                        {sortedContacts.map((contact) => (
                            <div
                                key={contact.id}
                                className={`contact ${selectedContact && contact.id === selectedContact.id ? 'selected' : ''}`}
                                onClick={() => handleContactClick(contact)}
                            >
                                <img src={contact.profilePic} alt="Profile" className="contact-pic" />
                                <div className="contact-name">{contact.name}</div>
                                <div className="last-message">{contact.lastMessage}</div>
                                <div className="contact-time">
                                    {formatRelativeTime(contact.timestamp)} 
                                </div>
                            </div>
                        ))}
                    </div>
                    {selectedContact ? (
                        <MessageContainer
                            messages={messages[selectedContact.id]}
                            contact={selectedContact} // Make sure this is correctly passed
                            onSendMessage={handleNewMessage}
                        />
                    ) : (
                        <p>Select a contact to view messages.</p>
                    )}

                </main>
            </div>

            <MainBottom />
            <Footer />
        </div>

    )

}