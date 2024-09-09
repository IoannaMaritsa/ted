const supabase = require('../supabaseClient');

const addJob = async (title, company, location, publishDate, type, profession, experience, salary, details, creatorEmail) => {
    try {
        const { data, error } = await supabase
            .from('jobs')
            .insert([{ 
                title,  
                company, 
                location,  
                publish_date: publishDate,
                type, 
                profession, 
                experience, 
                salary, 
                details ,
                creator_email: creatorEmail
            }]);

        if (error) {
            throw error;
        }

        console.log('Job added successfully:', data);
        return { success: true, job: data };
    } catch (err) {
        console.error('Error adding job:', err);
        return { success: false, message: 'error adding job' };
    }
};

const updateJob = async (jobId, updatedData) => {
    try {
        const { data, error } = await supabase
            .from('jobs')
            .update(updatedData)
            .select('id')
            .eq('id', jobId)
            .single();

        if (error) {
            throw error;
        }

        if (!data) {
            console.log(`No job with ID ${jobId} found.`);
            return { success: false, message: 'Job not found' };
        }

        console.log(`Job with ID ${jobId} updated:`, data);
        return { success: true, job: data };
    } catch (err) {
        console.error('Error updating job:', err);
        return { success: false, message: 'Error updating job' };
    }
};

const deleteJob = async (jobId) => {
    try {
        const { data, error } = await supabase
            .from('jobs')
            .delete()
            .select('id')
            .eq('id', jobId)
            .single();

        if (error) {
            throw error;
        }

        if (!data) {
            console.log(`No job with ID ${jobId} found.`);
            return { success: false, message: 'Job not found' };
        }

        console.log(`Job with ID ${jobId} deleted:`, data);
        return { success: true, message: 'Job deleted' };
    } catch (err) {
        console.error('Error deleting job:', err);
        return { success: false, message: 'Error deleting job' };
    }
};

const getJobOfUser = async (userEmail) => {
    try {
        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('creator_email', userEmail)
            .order('publish_date', { ascending: false });

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            console.log(`No jobs found for user with ID ${userEmail}.`);
            return { success: false, message: 'No jobs found' };
        }

        console.log(`Found jobs for user with ID ${userEmail}:`, data);
        return { success: true, data: data };
    } catch (err) {
        console.error('Error getting jobs for user:', err);
        return { success: false, message: 'Error getting jobs' };
    }
};

module.exports = {
    addJob,
    updateJob,
    deleteJob,
    getJobOfUser
};