import React, { useState, useEffect } from "react";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLocation, useNavigate } from 'react-router-dom';
import MainBottom from '../components/MainBottom';
import '../css/epag-messages.css';
import Breadcrumbs from "../components/Breadcrumbs";
import MessageContainer from "../components/MessageContainer";

const parseRelativeTime = (relativeTime) => {
    const now = Date.now();
    const timeMapping = {
        min: 1,
        h: 60,
        d: 1440, // 24 hours * 60 minutes
        w: 10080, // 7 days * 24 hours * 60 minutes
        m: 43830,
        y: 525960
    };

    const match = relativeTime.match(/^(\d+)([mhdw])$/);
    if (match) {
        const [, value, unit] = match;
        return parseInt(value) * timeMapping[unit];
    }

    return 0; // Default for unknown formats
};

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
            read: true
        },
        {
            id: 2, // Unique ID
            name: 'Jane Smith',
            profilePic: '/default-avatar.jpeg',
            lastMessage: '',
            timestamp: '1h',
            read: true
        },
        {
            id: 3, // Unique ID
            name: 'Alice Johnson',
            profilePic: '/default-avatar.jpeg',
            lastMessage: '',
            timestamp: '5m',
            read: false
        },
        {
            id: 4, // Unique ID
            name: 'Michael Brown',
            profilePic: '/default-avatar.jpeg',
            lastMessage: '',
            timestamp: '1w',
            read: false
        },
        {
            id: 5, // Unique ID
            name: 'Emily Davis',
            profilePic: '/default-avatar.jpeg',
            lastMessage: '',
            timestamp: '3d',
            read: true
        }
    ]);


    const formatRelativeTime = (date) => {
        const now = new Date();
        const diff = now - date; // Difference in milliseconds
        const diffInMinutes = Math.floor(diff / (1000 * 60));
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);
        const diffInMonths = Math.floor(diffInDays / 30); // Approximate month
        const diffInYears = Math.floor(diffInDays / 365); // Approximate year

        if (diffInYears > 0) {
            return `${diffInYears}y`;
        } else if (diffInMonths > 0) {
            return `${diffInMonths}m`;
        } else if (diffInDays > 0) {
            return `${diffInDays}d`;
        } else if (diffInHours > 0) {
            return `${diffInHours}h`;
        } else if (diffInMinutes > 0) {
            return `${diffInMinutes}min`;
        } else {
            return 'now'; // For messages sent within the last minute
        }
    };



    const parseTime = (timeString) => {
        const [time, period] = timeString.split(' ');
        const [hours, minutes] = time.split(':').map(Number);

        const isPM = period === 'PM';
        const adjustedHours = isPM ? (hours % 12) + 12 : hours % 12;

        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), adjustedHours, minutes);
    };



    useEffect(() => {
        setContacts(prevContacts =>
            prevContacts.map(c => {
                const contactMessages = messages[c.id] || [];
                const latestMessage = contactMessages[contactMessages.length - 1]; // Get the most recent message

                if (latestMessage) {
                    return {
                        ...c,
                        lastMessage: latestMessage.text,

                        timestamp: latestMessage ? formatRelativeTime(parseTime(latestMessage.timestamp)) : '', // Update contact's timestamp or leave empty
                        read: c.read // Ensure `read` status is preserved
                    };
                }
                return c;
            })
        );
    }, [messages]);




    const sortedContacts = [...contacts].sort((a, b) => parseRelativeTime(a.timestamp) - parseRelativeTime(b.timestamp));
    const [selectedContact, setSelectedContact] = useState(sortedContacts[1]);



    const handleContactClick = (contact) => {
        setSelectedContact(contact);

        // Mark messages as read when a contact is selected
        setMessages(prevMessages => {
            const updatedMessages = { ...prevMessages };
            if (updatedMessages[contact.id]) {
                updatedMessages[contact.id] = updatedMessages[contact.id].map(msg => ({
                    ...msg,
                    read: true
                }));
            }
            return updatedMessages;
        });

        // Update contact as read
        setContacts(prevContacts =>
            prevContacts.map(c =>
                c.id === contact.id ? { ...c, read: true } : c
            )
        );
    };


    const formatTime = (date) => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const isPM = hours >= 12;

        // Convert hours from 24-hour to 12-hour format
        const displayHours = hours % 12 || 12; // Show 12 instead of 0 for midnight/noon
        const displayMinutes = minutes.toString().padStart(2, '0'); // Ensure two digits for minutes

        // Format AM/PM
        const period = isPM ? 'PM' : 'AM';

        return `${displayHours}:${displayMinutes} ${period}`;
    };


    const handleNewMessage = (text) => {
        if (!selectedContact) return;

        const now = new Date();
        const formattedTimestamp = formatTime(now); // Use the 11:11 AM format

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
                        timestamp: formatRelativeTime(parseTime(formattedTimestamp)), // Update contact's last message timestamp
                        read: true // Set to unread if it’s the most recent message
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
                                className={`contact ${contact.id === selectedContact.id ? 'selected' : ''} ${contact.read ? 'contact-read' : 'contact-unread'}`}
                                onClick={() => handleContactClick(contact)}
                            >
                                <img src={contact.profilePic} alt="Profile" className="contact-pic" />
                                <div className="contact-name">{contact.name}</div>
                                <div className="last-message">{contact.lastMessage}</div>
                                <div className="contact-time">{contact.timestamp}</div>
                            </div>
                        ))}
                    </div>
                    <MessageContainer contact={selectedContact}
                        messages={messages[selectedContact.id] || []}
                        onSendMessage={handleNewMessage} />

                </main>
            </div>

            <MainBottom />
            <Footer />
        </div>

    )

}