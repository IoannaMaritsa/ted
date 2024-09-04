const supabase = require('../supabaseClient');

// Function to insert a new article
const addArticle = async (title, authorId, publishDate, content) => {
    try {
        const { data, error } = await supabase
            .from('articles')
            .insert([{ title, author_id: authorId, publish_date: publishDate, content }])
            .single();

        if (error) {
            throw error;
        }

        console.log('Article inserted with ID:', data.id);
        return data.id; // Return the ID of the inserted article
    } catch (err) {
        console.error('Error inserting article:', err);
        throw err;
    }
};

// Function to get all articles by a specific user
const getArticlesByUserId = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .eq('author_id', userId)
            .order('publish_date', { ascending: false });

        if (error) {
            throw error;
        }

        if (data.length === 0) {
            console.log(`No articles found for user with ID ${userId}.`);
            return { success: false, message: 'No articles found', articles: [] };
        }

        console.log(`Found ${data.length} article(s) for user with ID ${userId}.`);
        return data;
    } catch (err) {
        console.error('Error retrieving articles:', err);
        return { success: false, message: 'Error retrieving articles' };
    }
};

// Function to delete an article by its ID
const deleteArticleById = async (articleId) => {
    try {
        const { data, error } = await supabase
            .from('articles')
            .delete()
            .eq('id', articleId)
            .select();

        if (error) {
            throw error;
        }

        if (data.length === 0) {
            console.log(`Article with ID ${articleId} not found.`);
            return { success: false, message: 'Article not found' };
        }

        console.log(`Article with ID ${articleId} deleted.`);
        return { success: true, message: 'Article deleted successfully' };
    } catch (err) {
        console.error('Error deleting article:', err);
        return { success: false, message: 'Error deleting article' };
    }
};

// Add an article to a user's list of interests
const addInterest = async (userId, articleId) => {
    try {
        const { error } = await supabase
            .from('user_interests')
            .upsert([{ user_id: userId, article_id: articleId }], { onConflict: ['user_id', 'article_id'] });

        if (error) {
            throw error;
        }

        console.log(`Article ${articleId} added to user ${userId}'s interests.`);
    } catch (error) {
        console.error('Error adding interest:', error);
        throw error;
    }
};

// Remove an article from a user's list of interests
const removeInterest = async (userId, articleId) => {
    try {
        const { error } = await supabase
            .from('user_interests')
            .delete()
            .eq('user_id', userId)
            .eq('article_id', articleId);

        if (error) {
            throw error;
        }

        console.log(`Article ${articleId} removed from user ${userId}'s interests.`);
    } catch (error) {
        console.error('Error removing interest:', error);
        throw error;
    }
};

// Get all articles that a user is interested in
const getUserInterests = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('user_interests')
            .select('article_id, articles (*)')
            .eq('user_id', userId);

        if (error) {
            throw error;
        }

        console.log(data);
        return data.map(item => item.articles); // Assuming articles are nested in the result
    } catch (error) {
        console.error('Error retrieving user interests:', error);
        throw error;
    }
};

module.exports = {
    addArticle,
    getArticlesByUserId,
    deleteArticleById,
    addInterest,
    removeInterest,
    getUserInterests
};