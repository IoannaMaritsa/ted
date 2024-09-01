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
        return res.rows;
    } catch (err) {
        console.error('Error fetching comments:', err);
    }
};

// Function to get comments of a user
const getCommentsOfUser = async (authorId) => {
    const query = `
        SELECT * 
        FROM comments
        WHERE author_id = $1;
    `;
    const values = [authorId];

    try {
        const res = await pool.query(query, values);
        console.log('Comments:', res.rows);
        return res.rows;
    } catch (err) {
        console.error('Error fetching comments:', err);
    }
};

const deleteComment = async (commentId) => {
    try {
        const result = await pool.query(
            'DELETE FROM comments WHERE id = $1 RETURNING *',
            [commentId]
        );

        if (result.rowCount === 0) {
            console.log(`No comment with ID ${commentId} found.`);
            return { success: false, message: 'Comment not found' };
        }

        console.log(`Comment with ID ${commentId} deleted.`);
        return { success: true, message: 'Comment deleted' };
    } catch (err) {
        console.error('Error deleting comment:', err);
        return { success: false, message: 'Error deleting comment' };
    } finally {
        pool.release();
    }
};

// Example usage
// addComment(1, 2, 'This is a comment on the article.');
// getComments(1);
module.exports = {
    addComment,
    getComments,
    getCommentsOfUser,
    deleteComment
};