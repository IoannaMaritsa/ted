const supabase = require('../supabaseClient');

// Add a submission
const addSubmission = async (jobId, userEmail, submissionDate) => {
    try {
        const { data, error } = await supabase
            .from('submissions')
            .insert([{ 
                job_id: jobId, 
                user_email: userEmail, 
                submission_date: submissionDate 
            }])

        if (error) {
            throw error;
        }

        return { success: true, submission: data };
    } catch (err) {
        console.error('Error adding submission:', err);
        return { success: false, message: 'Error adding submission' };
    }
};

// Get all submissions for a job
const getSubmissionsForJob = async (jobId) => {
    try {
        const { data, error } = await supabase
            .from('submissions')
            .select(`
                id,
                submission_date,
                users (email , name)
            `)
            .eq('job_id', jobId)
            .order('submission_date', { ascending: false });

        if (error) {
            throw error;
        }

        return { success: true, data: data };
    } catch (err) {
        console.error('Error fetching submissions:', err);
        return { success: false, message: 'Error fetching submissions' };
    }
};

module.exports = {
    addSubmission,
    getSubmissionsForJob
};
