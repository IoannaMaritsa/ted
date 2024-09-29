const supabase = require('../supabaseClient');

// Get all contacts for a user by email
const getAllContactsByEmail = async (userEmail) => {
    try {
        const { data, error } = await supabase
            .from('contacts')
            .select('contact_email')
            .eq('user_email', userEmail);
        if (error) {
            console.error('Error getting contacts:', error);
            throw error;
        }
        return data;
    } catch (err) {
        console.error('Error getting contacts:', err);
        throw err;
    }
};


// Add a contact for a user by email
const addContact = async (userEmail, contactEmail) => {
    try {
        const { data, error } = await supabase
            .from('contacts')
            .upsert([
                { user_email: userEmail, contact_email: contactEmail },
                { user_email: contactEmail, contact_email: userEmail }
            ]);
        if (error) {
            console.error('Error adding contact:', error);
            throw error;
        }
        return data;
    } catch (err) {
        console.error('Error adding contact:', err);
        throw err;
    }
};


// Remove a contact for a user by email
const removeContact = async (userEmail, contactEmail) => {
    try {
        const { data: data1, error: error1 } = await supabase
            .from('contacts')
            .delete()
            .match({ user_email: userEmail, contact_email: contactEmail });

        if (error1) {
            console.error('Error removing contact (first query):', error1);
            throw error1;
        }

        const { data: data2, error: error2 } = await supabase
            .from('contacts')
            .delete()
            .match({ user_email: contactEmail, contact_email: userEmail });

        if (error2) {
            console.error('Error removing contact (second query):', error2);
            throw error2;
        }

        return { data1, data2 };
    } catch (err) {
        console.error('Error removing contact:', err);
        throw err;
    }
};

module.exports = {
    addContact,
    getAllContactsByEmail,
    removeContact
};