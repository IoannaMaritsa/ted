const pool = require('../db');

// Function to add a comment
const addComment = async (articleId, authorId, text) => {
    const query = `
        INSERT INTO comments (article_id, author_id, text)
        VALUES ($1, $2, $3);
    `;
    const values = [articleId, authorId, text];

    try {
        await pool.query(query, values);
        console.log('Comment added successfully.');
    } catch (err) {
        console.error('Error adding comment:', err);
    }
};

// Function to get comments for an article
const getComments = async (articleId) => {
    const query = `
        SELECT * 
        FROM comments
        WHERE article_id = $1;
    `;
    const values = [articleId];

    try {
        const res = await pool.query(query, values);
        console.log('Comments:', res.rows);
    } catch (err) {
        console.error('Error fetching comments:', err);
    }
};

// Example usage
// addComment(1, 2, 'This is a comment on the article.');
// getComments(1);