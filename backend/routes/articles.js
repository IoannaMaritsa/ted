const pool = require('../db');

// Function to insert a new article
const addArticle = async (title, authorId, publishDate, content) => {
    const query = `
        INSERT INTO articles (title, author_id, publish_date, content)
        VALUES ($1, $2, $3, $4)
        RETURNING id
    `;
    const values = [title, authorId, publishDate, content];

    try {
        const res = await pool.query(query, values);
        console.log('Article inserted with ID:', res.rows[0].id);
    } catch (err) {
        console.error('Error inserting article:', err);
    }
};

// Function to get all articles by a specific user
const getArticlesByUserId = async (userId) => {
    try {
        const result = await pool.query(
            'SELECT * FROM articles WHERE author_id = $1 ORDER BY publish_date DESC',
            [userId]
        );

        if (result.rows.length === 0) {
            console.log(`No articles found for user with ID ${userId}.`);
            return { success: false, message: 'No articles found', articles: [] };
        }

        console.log(`Found ${result.rows.length} article(s) for user with ID ${userId}.`);
        return result.rows;
    } catch (err) {
        console.error('Error retrieving articles:', err);
        return { success: false, message: 'Error retrieving articles' };
    } finally {
        pool.release();
    }
};

// Function to delete an article by its ID
const deleteArticleById = async (articleId) => {
    try {
        const result = await pool.query(
            'DELETE FROM articles WHERE id = $1 RETURNING *',
            [articleId]
        );

        if (result.rowCount === 0) {
            console.log(`Article with ID ${articleId} not found.`);
            return { success: false, message: 'Article not found' };
        }

        console.log(`Article with ID ${articleId} deleted.`);
        return { success: true, message: 'Article deleted successfully' };
    } catch (err) {
        console.error('Error deleting article:', err);
        return { success: false, message: 'Error deleting article' };
    } finally {
        pool.release();
    }
};

// Add an article to a user's list of interests
const addInterest = async (userId, articleId) => {
    try {
        const query = `
            INSERT INTO user_interests (user_id, article_id)
            VALUES ($1, $2)
            ON CONFLICT (user_id, article_id) DO NOTHING;
        `;
        await pool.query(query, [userId, articleId]);
        console.log(`Article ${articleId} added to user ${userId}'s interests.`);
    } catch (error) {
        console.error('Error adding interest:', error);
        throw error;
    }
}

// Remove an article from a user's list of interests
const removeInterest = async (userId, articleId) => {
    try {
        const query = `
            DELETE FROM user_interests
            WHERE user_id = $1 AND article_id = $2;
        `;
        await pool.query(query, [userId, articleId]);
        console.log(`Article ${articleId} removed from user ${userId}'s interests.`);
    } catch (error) {
        console.error('Error removing interest:', error);
        throw error;
    }
}

// Get all articles that a user is interested in
const getUserInterests = async (userId) => {
    try {
        const query = `
            SELECT a.*
            FROM articles a
            JOIN user_interests ui ON a.id = ui.article_id
            WHERE ui.user_id = $1;
        `;
        const result = await pool.query(query, [userId]);
        console.log(result.rows);
        return result.rows;
    } catch (error) {
        console.error('Error retrieving user interests:', error);
        throw error;
    }
}
// Example usage
// addArticle('New Article Title', 1, '2024-08-20', 'This is the content of the new article.');
//addInterest(2, 1);
//getUserInterests(2);

module.exports = {
    addArticle,
    getArticlesByUserId,
    deleteArticleById,
    addInterest,
    removeInterest,
    getUserInterests
};