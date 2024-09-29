const supabase = require('../supabaseClient');

// Add a comment
const addComment = async (articleId, authorEmail, text) => {
    const now = new Date();

    try {
        const { data, error } = await supabase
            .from('comments')
            .insert([{ article_id: articleId, author_email: authorEmail, text , created_at:now}]);

        if (error) {
            throw error;
        }

    } catch (err) {
        console.error('Error adding comment:', err);
    }
};

// Get comments for an article
const getComments = async (articleId) => {
    try {
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('article_id', articleId);

        if (error) {
            throw error;
        }

        return data;
    } catch (err) {
        console.error('Error fetching comments:', err);
    }
};


// Get all comments
const getAllComments = async (articleId) => {
    try {
        const { data, error } = await supabase
            .from('comments')
            .select('*')

        if (error) {
            throw error;
        }

        return data;
    } catch (err) {
        console.error('Error fetching comments:', err);
    }
};

// Function to get comments of a user
const getCommentsOfUser = async (authorEmail) => {
    try {
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('author_email', authorEmail);

        if (error) {
            throw error;
        }

        return data;
    } catch (err) {
        console.error('Error fetching comments:', err);
    }
};

// Delete a comment
const deleteComment = async (commentId) => {
    try {
        const { data, error } = await supabase
            .from('comments')
            .delete()
            .match({ id: commentId });

        if (error) {
            throw error;
        }

        if (data.length === 0) {
            console.error(`No comment with ID ${commentId} found.`);
            return { success: false, message: 'Comment not found' };
        }

        return { success: true, message: 'Comment deleted' };
    } catch (err) {
        console.error('Error deleting comment:', err);
        return { success: false, message: 'Error deleting comment' };
    }
};

module.exports = {
    addComment,
    getComments,
    getCommentsOfUser,
    getAllComments,
    deleteComment
};