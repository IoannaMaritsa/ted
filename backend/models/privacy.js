const supabase = require('../supabaseClient');

// Create a new privacy row
const addPrivacy = async (userEmail) => {
    try {
        const { data, error } = await supabase
            .from('privacy')
            .insert({
                user_email: userEmail,
                work_private: true,
                location_private: true,
                birthday_private: true,
                email_private: true,
                workExperience_private: true,
                studies_private: true,
                skills_private: true
            })
            .single(); 

        if (error) {
            console.error('Error creating privacy record:', error);
            throw error;
        }

        return data;
    } catch (err) {
        console.error('Error in createPrivacyRecord function:', err);
        throw err;
    }
};

// Get privacy settings for a user
const getPrivacySettings = async (user_email) => {
    try {
        const { data, error } = await supabase
            .from('privacy')
            .select('*')
            .eq('user_email', user_email);

        if (error) {
            console.error('Error getting privacy settings for user:', error);
            throw error;
        }

        return data;
    } catch (err) {
        console.error('Error getting privacy settings for user:', err);
        throw err;
    }
};

// Update the privacy field of a user
const updatePrivacy = async (userEmail, privacyField, newValue) => {
    try {

        const { data, error } = await supabase
            .from('privacy')
            .update({ [privacyField]: newValue })
            .eq('user_email', userEmail)
            .single(); 

        if (error) {
            console.error('Error updating privacy field:', error);
            throw error;
        }

    } catch (error) {
        console.error('Error in updatePrivacyFieldForUser:', error);
        throw error; 
    }
};

module.exports = {
    addPrivacy,
    getPrivacySettings,
    updatePrivacy
};