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
        const results = await pool.query(query, values);
        console.log('Contacts:', results.rows);
        return results.rows;
    } catch (err) {
        console.error('Error fetching contacts:', err);
    }
};

// Function to delete a contact from a user
const deleteContactFromUser = async (userId, contactId) => {
    try {
        const result = await pool.query(
            'DELETE FROM contacts WHERE user_id = $1 AND contact_id = $2 RETURNING *',
            [userId, contactId]
        );

        if (result.rowCount === 0) {
            console.log(`No contact with ID ${contactId} found for user with ID ${userId}.`);
            return { success: false, message: 'Contact not found for user' };
        }

        console.log(`Contact with ID ${contactId} deleted for user with ID ${userId}.`);
        return { success: true, message: 'Contact deleted' };
    } catch (err) {
        console.error('Error deleting contact:', err);
        return { success: false, message: 'Error deleting contact' };
    } finally {
        pool.release();
    }
};
// Example usage
// addContact(2, 1); // Add Alice (user_id = 1) as a contact for Bob (user_id = 2)
// getContacts(2);   // Fetch contacts for Bob (user_id = 2)
module.exports = {
    addContact,
    getContacts,
    deleteContactFromUser
};