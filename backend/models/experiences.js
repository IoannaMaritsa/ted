const supabase = require('../supabaseClient');

// Function to add a new experience
const addExperience = async (userId, profession, workplace, startDate, endDate) => {
    try {
        const { data, error } = await supabase
            .from('experiences')
            .insert([{ user_id: userId, profession, workplace, start_date: startDate, end_date: endDate }])
            .single();

        if (error) {
            console.error('Error adding experience:', error);
            throw error;
        }

        return data;
    } catch (err) {
        console.error('Error adding experience:', err);
        throw err;
    }
};

// Function to get experiences by user ID
const getExperiencesByUserId = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('experiences')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            console.error('Error getting experiences by user ID:', error);
            throw error;
        }

        return data;
    } catch (err) {
        console.error('Error getting experiences by user ID:', err);
        throw err;
    }
};

// Function to delete an experience
const deleteUserExperience = async (experienceId) => {
    try {
        const { data, error } = await supabase
            .from('experiences')
            .delete()
            .eq('id', experienceId)
            .single();

        if (error) {
            if (error.code === 'PGRST115') { // Not found error in Supabase
                console.log(`Experience with ID ${experienceId} not found.`);
                return { success: false, message: 'Experience not found' };
            }
            console.error('Error deleting experience:', error);
            throw error;
        }

        console.log(`Experience with ID ${experienceId} deleted.`);
        return { success: true, message: 'Experience deleted successfully' };
    } catch (err) {
        console.error('Error deleting experience:', err);
        return { success: false, message: 'Error deleting experience' };
    }
};

module.exports = {
    addExperience,
    getExperiencesByUserId,
    deleteUserExperience
};