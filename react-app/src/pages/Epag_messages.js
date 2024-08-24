import React, { useState, useEffect, useMemo } from "react";
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainBottom from '../components/MainBottom';
import '../css/epag-messages.css';
import Breadcrumbs from "../components/Breadcrumbs";
import MessageContainer from "../components/MessageContainer";
import {parseRelativeTime, formatRelativeTime, formatTime} from "../utils/timeUtils";

export default function Epag_messages() {

    const [messages, setMessages] = useState({
        1: [ // John's messages
            { fromUser: false, text: 'Hi!', timestamp: '10:00 AM' },
            { fromUser: true, text: 'Hello!', timestamp: '10:05 AM' },
            { fromUser: true, text: 'Whats up?', timestamp: '10:05 AM' },
            { fromUser: false, text: 'Lorem ipsum odor amet, consectetuer adipiscing elit. Eros ultrices nec nunc suspendisse inceptos platea viverra. Facilisi placerat viverra, urna donec mauris duis quis vel. Iaculis nulla finibus malesuada scelerisque feugiat ex! Inceptos sociosqu dictumst rutrum facilisis integer; pretium mollis duis. Sed in montes amet hac himenaeos orci maecenas eros.', timestamp: '10:10 AM' },
        ],
        2: [ // Jane's messages
            { fromUser: false, text: 'Good morning!', timestamp: '9:00 AM' },
            { fromUser: true, text: 'Good morning!', timestamp: '9:10 AM' }
        ],
        3: [ // Alice's messages
            { fromUser: true, text: 'Are you available?', timestamp: '8:00 AM' },
            { fromUser: false, text: 'Yes, I am!', timestamp: '8:05 AM' }
        ]
    });


    const [contacts, setContacts] = useState([
        {
            id: 1, // Unique ID
            name: 'John Doe',
            profilePic: '/default-avatar.jpeg',
            lastMessage: '',
            timestamp: '2d',
        },
        {
            id: 2, // Unique ID
            name: 'Jane Smith',
            profilePic: '/default-avatar.jpeg',
            lastMessage: '',
            timestamp: '1h',
        },
        {
            id: 3, // Unique ID
            name: 'Alice Johnson',
            profilePic: '/default-avatar.jpeg',
            lastMessage: '',
            timestamp: '5m',
        },
        {
            id: 4, // Unique ID
            name: 'Michael Brown',
            profilePic: '/default-avatar.jpeg',
            lastMessage: '',
            timestamp: '1w',
        },
        {
            id: 5, // Unique ID
            name: 'Emily Davis',
            profilePic: '/default-avatar.jpeg',
            lastMessage: '',
            timestamp: '3d',
        }
    ]);



    const sortedContacts = useMemo(() => {
        return [...contacts].sort(
            (a, b) => parseRelativeTime(a.timestamp) - parseRelativeTime(b.timestamp)
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
                
                if (latestMessage) {
                    return {
                        ...c,
                        lastMessage: latestMessage.text,
                        timestamp: formatRelativeTime(latestMessage.timestamp), // Update contact's timestamp
                    };
                }
                return {
                    ...c,
                    lastMessage: '',
                    timestamp: '', // Display an empty string for contacts with no messages
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

        const now = new Date();
        const formattedTimestamp = formatTime(now); 

        const newMessage = { fromUser: true, text, timestamp: formattedTimestamp };

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
                        timestamp: formatRelativeTime(formattedTimestamp), // Update contact's last message timestamp
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
                                <div className="contact-time">{contact.timestamp}</div>
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