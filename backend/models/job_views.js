const supabase = require('../supabaseClient');

// Add a view to a job
async function addViewtoJob(userEmail, jobId) {
    try {
        // Check if the view already exists
        const { data: view, error: viewError } = await supabase
            .from('job_views')
            .select('*')
            .eq('user_email', userEmail)
            .eq('job_id', jobId)
            .limit(1);

        if (viewError) {
            throw viewError;
        }

        if (view && view.length>0) {
            // Increment the count if the view already exists
            const newView = {
                count: view[0].count + 1,
            };

            const { data, error } = await supabase
                .from('job_views')
                .update(newView)
                .eq('user_email', userEmail)
                .eq('job_id', jobId)
                .single();

            if (error) {
                throw error;
            }
        } else {
            // Insert a new view if it does not exist
            const { error: jobViewError } = await supabase
                .from('job_views')
                .upsert({ user_email: userEmail, job_id: jobId, count: 1 }, { onConflict: ['user_email', 'job_id'] });

            if (jobViewError) {
                throw jobViewError;
            }

        }

    } catch (error) {
        console.error('Error adding view to job:', error);
        throw error; 
    }
}

// Get job views of a user
const getJobViewsByUser = async (userEmail) => {
    try {
        const { data: userViews, error: userViewsError } = await supabase
            .from('job_views')
            .select('*')
            .eq('user_email', userEmail);

        if (userViewsError) {
            throw userViewsError;
        }

        return userViews;

    } catch (error) {
        console.error('Error fetching views for user:', error);
        throw error;
    }
}

module.exports = {
    addViewtoJob,
    getJobViewsByUser
};