const supabase = require('../supabaseClient');

// Function to create a new privacy row
const addPrivacy = async (userEmail) => {
    try {
        // Insert a new row into the privacy table
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
            .single(); // Ensure only one row is inserted

        if (error) {
            console.error('Error creating privacy record:', error);
            throw error;
        }

        console.log('Privacy record created successfully:', data);
        return data;
    } catch (err) {
        console.error('Error in createPrivacyRecord function:', err);
        throw err;
    }
};

// Function to get privacy settings for a user
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

const updatePrivacy = async (userEmail, privacyField, newValue) => {
    try {

        // Update the specific privacy field for the user
        const { data, error } = await supabase
            .from('privacy')
            .update({ [privacyField]: newValue })
            .eq('user_email', userEmail)
            .single(); 

        if (error) {
            console.error('Error updating privacy field:', error);
            throw error;
        }

        console.log(`Privacy field '${privacyField}' updated to '${newValue}' for user: ${userEmail}`);
    } catch (error) {
        console.error('Error in updatePrivacyFieldForUser:', error);
        throw error; // Optional: re-throw error for further handling
    }
};

module.exports = {
    addPrivacy,
    getPrivacySettings,
    updatePrivacy
};