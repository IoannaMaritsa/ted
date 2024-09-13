const supabase = require('../supabaseClient');
const { getAttachments } = require('./attachments');

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
// Function to an article by its id
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

        const attachments = await getAttachments(articleId);

        if (attachments) {
            for (const attachment of attachments) {
                
                const filePath = new URL(attachment.url).pathname.replace('/storage/v1/object/attachments/', '');
                console.log('found attachment with filepath', filePath);

                // Delete the attachment picture from Supabase Storage
                const { error: deleteFileError } = await supabase
                    .storage
                    .from('attachments')
                    .remove([filePath]);

                if (deleteFileError) {
                    console.error('Error deleting image:', deleteFileError);
                    throw deleteFileError;
                }
                console.log(`Attachment picture deleted for article with id ${articleId}`);

            }
        }

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
    const now = new Date();

    try {
        const { error } = await supabase
            .from('user_interests')
            .upsert([{ user_email: userEmail, article_id: articleId, date: now }], { onConflict: ['user_email', 'article_id'] });

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
            .select('article_id')
            .eq('user_email', userEmail);

        if (error) {
            throw error;
        }

        const articleIds = data.map(item => item.article_id);
        return articleIds;

    } catch (error) {
        console.error('Error retrieving user interests:', error);
        throw error;
    }
};

// Get all the users that are interested in an article
const getArticleInterests = async (articleId) => {
    try {
        const { data, error } = await supabase
            .from('user_interests')
            .select('*')
            .eq('article_id', articleId)
            .order('date', { ascending: false });

        if (error) {
            throw error;
        }

        return data;

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
    getArticleInterests,
    getArticlesNotByUserEmail,
    getArticlesById
};