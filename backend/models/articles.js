const supabase = require('../supabaseClient');

// Function to insert a new article
const addArticle = async (title, authorEmail, publishDate, content) => {
    try {
        const { data, error } = await supabase
            .from('articles')
            .insert([{ title, author_email: authorEmail, publish_date: publishDate, content }])
            .select('id') // Ensure that Supabase returns the id of the inserted row
            .single();

        if (error) {
            throw error;
        }

        if (!data) {
            throw new Error('Insert operation did not return any data.');
        }

        const articleId = data.id; // Assuming 'id' is the name of the auto-generated ID column
        console.log('Article inserted with ID:', articleId);
        return articleId; // Return the ID of the inserted article
    } catch (err) {
        console.error('Error inserting article:', err);
        throw err;
    }
};

// Function to get all articles by a specific user
const getArticlesByUserEmail = async (userEmail) => {
    try {
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .eq('author_email', userEmail)
            .order('publish_date', { ascending: false });

        if (error) {
            throw error;
        }

        if (data.length === 0) {
            console.log(`No articles found for user with ID ${userEmail}.`);
            return { success: false, message: 'No articles found', articles: [] };
        }

        console.log(`Found ${data.length} article(s) for user with ID ${userEmail}.`);
        return data;
    } catch (err) {
        console.error('Error retrieving articles:', err);
        return { success: false, message: 'Error retrieving articles' };
    }
};
// Function to get all articles by a specific user
const getArticlesById = async (id) => {
    try {
        const { data, error } = await supabase.from('articles').select('*').eq('id', id).single();
        if (error) {
            console.error('Error getting article by id:', error);
            throw error;
        }
        if (data.length === 0) {
            console.log(`No article found with id ${id}.`);
            return null;
        }
        console.log(`Successfully retrieved article with id ${id}.`);
        return data;
    } catch (err) {
        console.error('Error getting article with id:', err);
        throw err;
    }
};
// Function to get all articles by a specific user
const getArticlesNotByUserEmail = async (userEmail) => {
    try {
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .neq('author_email', userEmail)
            .order('publish_date', { ascending: false });

        if (error) {
            throw error;
        }

        if (data.length === 0) {
            console.log(`No articles found for all users except user with ID ${userEmail}.`);
            return { success: false, message: 'No articles found', articles: [] };
        }

        console.log(`Found ${data.length} article(s) for every but user with ID ${userEmail}.`);
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
const addInterest = async (userEmail, articleId) => {
    try {
        const { error } = await supabase
            .from('user_interests')
            .upsert([{ user_email: userEmail, article_id: articleId }], { onConflict: ['user_email', 'article_id'] });

        if (error) {
            throw error;
        }

        console.log(`Article ${articleId} added to user ${userEmail}'s interests.`);
    } catch (error) {
        console.error('Error adding interest:', error);
        throw error;
    }
};

// Remove an article from a user's list of interests
const removeInterest = async (userEmail, articleId) => {
    try {
        const { error } = await supabase
            .from('user_interests')
            .delete()
            .eq('user_email', userEmail)
            .eq('article_id', articleId);

        if (error) {
            throw error;
        }

        console.log(`Article ${articleId} removed from user ${userEmail}'s interests.`);
    } catch (error) {
        console.error('Error removing interest:', error);
        throw error;
    }
};

// Get all articles that a user is interested in
const getUserInterests = async (userEmail) => {
    try {
        const { data, error } = await supabase
            .from('user_interests')
            .select('article_id, articles (*)')
            .eq('user_email', userEmail);

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
    getArticlesByUserEmail,
    deleteArticleById,
    addInterest,
    removeInterest,
    getUserInterests,
    getArticlesNotByUserEmail,
    getArticlesById
};