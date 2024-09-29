const supabase = require('../supabaseClient');

// Add a new study
const addStudies = async (userId, university, degree, startDate, endDate) => {
    try {
        const { data, error } = await supabase
            .from('studies')
            .insert([{ user_id: userId, university, degree, start_date: startDate, end_date: endDate }])
            .single();

        if (error) {
            throw error;
        }

        return data;
    } catch (err) {
        console.error('Error adding studies:', err);
        throw err;
    }
};

// Get studies by user ID
const getStudiesByUserId = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('studies')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            throw error;
        }

        return data;
    } catch (err) {
        console.error('Error getting studies by user ID:', err);
        throw err;
    }
};

// Delete a study
const deleteUserStudy = async (studyId) => {
    try {
        const { data, error } = await supabase
            .from('studies')
            .delete()
            .eq('id', studyId)
            .single();

        if (error) {
            console.error(`Study with ID ${studyId} not found.`);
            return { success: false, message: 'Study not found' };
        }

        return { success: true, message: 'Study deleted successfully', data };
    } catch (err) {
        console.error('Error deleting study:', err);
        return { success: false, message: 'Error deleting study' };
    }
};

module.exports = {
    addStudies,
    getStudiesByUserId,
    deleteUserStudy
};