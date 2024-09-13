import React, { useState, useEffect, useMemo } from "react";
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainBottom from '../components/MainBottom';
import '../css/epag-messages.css';
import Breadcrumbs from "../components/Breadcrumbs";
import MessageContainer from "../components/MessageContainer";
import { parseRelativeTime, formatRelativeTime, formatTime } from "../utils/timeUtils";
import { getAllContactsByUserEmail, getMessagesBetweenUsers, addMessage, getUser} from "../api";
import getImageUrl from "../hooks/getImageUrl";
import { useAppContext } from "../context/appContext";

export default function Epag_messages() {
    const { user } = useAppContext();
    const [contacts, setContacts] = useState([]);
    const [messages, setMessages] = useState({});
    const [selectedContact, setSelectedContact] = useState(null);


    // Fetch contacts and messages
    const fetchContactsAndMessages = async () => {
        try {
            // Fetch connected users
            const contacts = await getAllContactsByUserEmail(user.email);
            const contactEmails = contacts.map(contact => contact.contact_email);
            const contactDetailsPromises = contactEmails.map(email => getUser(email));
            const contactsData = await Promise.all(contactDetailsPromises);

            // Fetch messages for all contacts
            const messagesData = {};
            for (const contact of contactsData) {
                const contactMessages = await getMessagesBetweenUsers(contact.email, user.email);
                messagesData[contact.email] = contactMessages;
            }
            setMessages(messagesData);

            // Sort contacts based on the latest message
            const sortedContacts = [...contactsData].sort((a, b) => {
                const lastMessageA = messagesData[a.email]?.[messagesData[a.email].length - 1]?.created_at;
                const lastMessageB = messagesData[b.email]?.[messagesData[b.email].length - 1]?.created_at;
                return new Date(lastMessageB) - new Date(lastMessageA);
            });

            setContacts(sortedContacts);

            // Set the first contact as the selected contact
            const firstContactWithMessages = sortedContacts[0];
            setSelectedContact(firstContactWithMessages);
        } catch (error) {
            console.error('Error fetching contacts and messages:', error);
        }
    };

    useEffect(() => {

        // Trigger an immediate fetch on component mount
        fetchContactsAndMessages();

        // Polling messages every 5 seconds
        const interval = setInterval(() => {
          fetchContactsAndMessages();
        }, 5000);
    
        return () => clearInterval(interval);
      }, []);



    // Fetch messages for the selected contact if not already present
    useEffect(() => {
        if (selectedContact && !messages[selectedContact.email]) {
            const fetchMessages = async () => {
                try {
                    const contactMessages = await getMessagesBetweenUsers(selectedContact.email, user.email);
                    setMessages(prevMessages => ({ ...prevMessages, [selectedContact.email]: contactMessages }));
                } catch (err) {
                    console.error('Error fetching messages:', err);
                }
            };
            fetchMessages();
        }
    }, [selectedContact, messages, user.email]);

    // Ensure that when messages are updated, selectedContact is set correctly
    useEffect(() => {
        if (contacts.length > 0 && !selectedContact) {
            const firstContactWithMessages = contacts.find(contact => messages[contact.email]?.length > 0) || contacts[0];
            setSelectedContact(firstContactWithMessages);
        }
    }, [contacts, messages, selectedContact]);


    // Change the selected contact on contact click
    const handleContactClick = (contact) => {
        setSelectedContact(contact);
    };

    // Handle message creation
    const handleNewMessage = async (text) => {
        if (!selectedContact) return;
        const now = new Date().toISOString();

        const newMessage = {
            sender_email: user.email,
            receiver_email: selectedContact.email,
            text: text,
            created_at: now,
        };

        // Simulate adding the message locally
        setMessages(prevMessages => {
            const updatedMessages = { ...prevMessages };
            if (updatedMessages[selectedContact.email]) {
                updatedMessages[selectedContact.email].push(newMessage);
            } else {
                updatedMessages[selectedContact.email] = [newMessage];
            }
            return updatedMessages;
        });

        await addMessage(user.email, selectedContact.email, text, now);
    };

    const sortedContacts = contacts;

    return (
        <div>
            <Header variant="professional" />
            <Breadcrumbs />
            <div className="messaging-page">
                <header className="mess-header">
                    <h1 className="title2">Συζητήσεις</h1>
                </header>
                <main className="main-content-mess">
    <div className="sidebar">
        {sortedContacts.length > 0 ? (
            sortedContacts.map((contact) => (
                <div
                    key={contact.email}
                    className={`contact ${selectedContact && contact.email === selectedContact.email ? 'selected' : ''}`}
                    onClick={() => handleContactClick(contact)}
                >
                    <img src={getImageUrl(contact.profilepic, "profilepics")} alt="Profile" className="contact-pic" />
                    <div className="contact-name">{contact.name}</div>
                    <div className="last-message">
                        {messages[contact.email]?.[messages[contact.email].length - 1]?.text || "No messages yet"}
                    </div>
                    <div className="contact-time">
                        {messages[contact.email]?.[messages[contact.email].length - 1]?.created_at
                            ? formatRelativeTime(new Date(messages[contact.email][messages[contact.email].length - 1].created_at))
                            : ""}
                    </div>
                </div>
            ))
        ) : (
            <div className="no-contacts-message">
                No contacts found.
            </div>
        )}
    </div>
    {selectedContact ? (
        <MessageContainer
            messages={messages[selectedContact.email]}
            contact={selectedContact} // Make sure this is correctly passed
            onSendMessage={handleNewMessage}
        />
    ) : (
        <div></div>
    )}
</main>

            </div>

            <MainBottom />
            <Footer />
        </div>

    )

}