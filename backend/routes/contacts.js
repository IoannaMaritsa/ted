const pool = require('../db');

// Function to add a contact for a user
const addContact = async (userId, contactId) => {
    const query = `
        INSERT INTO contacts (user_id, contact_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, contact_id) DO NOTHING;
    `;
    const values = [userId, contactId];

    try {
        await pool.query(query, values);
        console.log('Contact added successfully.');
    } catch (err) {
        console.error('Error adding contact:', err);
    }
};

// Function to fetch contacts for a user
const getContacts = async (userId) => {
    const query = `
        SELECT u.id, u.name, u.email
        FROM users u
        JOIN contacts c ON u.id = c.contact_id
        WHERE c.user_id = $1;
    `;
    const values = [userId];

    try {
        const res = await pool.query(query, values);
        console.log('Contacts:', res.rows);
    } catch (err) {
        console.error('Error fetching contacts:', err);
    }
};

// Example usage
// addContact(2, 1); // Add Alice (user_id = 1) as a contact for Bob (user_id = 2)
// getContacts(2);   // Fetch contacts for Bob (user_id = 2)