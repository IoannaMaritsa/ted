const supabase = require('../supabaseClient');

// Function to add a view to a job
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
            console.log('newcount', newView);

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

            console.log(`View added to job ID ${jobId}`);
        }

    } catch (error) {
        console.error('Error adding view to job:', error);
        throw error; // Optional: re-throw error for further handling
    }
}

// Function to get job views of a user
const getJobViewsByUser = async (userEmail) => {
    try {
        // Fetch views associated with the user
        const { data: userViews, error: userViewsError } = await supabase
            .from('job_views')
            .select('*')
            .eq('user_email', userEmail);

        if (userViewsError) {
            throw userViewsError;
        }

        if (!userViews || userViews.length === 0) {
            return []; // No views found for the user
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