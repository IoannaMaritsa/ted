const pool = require('../db');

const getAllContactsByUserId = async (user_id) => {
    try {
        const { data, error } = await supabase
            .from('contacts')
            .select('contact_id')
            .eq('user_id', user_id);
        if (error) {
            console.error('Error getting contacts:', error);
            throw error;
        }
        console.log(`Successfully retrieved contacts for user ID ${user_id}.`);
        return data;
    } catch (err) {
        console.error('Error getting contacts:', err);
        throw err;
    }
};

const addContact = async (user_id, contact_id) => {
    try {
        const { data, error } = await supabase
            .from('contacts')
            .insert([{ user_id, contact_id }, { user_id: contact_id, contact_id: user_id }]);
        if (error) {
            console.error('Error adding contact:', error);
            throw error;
        }
        console.log('Successfully added contact.');
        return data;
    } catch (err) {
        console.error('Error adding contact:', err);
        throw err;
    }
};


const removeContact = async (user_id, contact_id) => {
    try {
        const { data, error } = await supabase
            .from('contacts')
            .delete()
            .eq('user_id', user_id)
            .eq('contact_id', contact_id)
            .or(`user_id.eq.${contact_id},contact_id.eq.${user_id}`);
        if (error) {
            console.error('Error removing contact:', error);
            throw error;
        }
        console.log('Successfully removed contact.');
        return data;
    } catch (err) {
        console.error('Error removing contact:', err);
        throw err;
    }
};

module.exports = {
    addContact,
    getAllContactsByUserId,
    removeContact
};