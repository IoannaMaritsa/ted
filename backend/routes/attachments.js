const pool = require('../db');

// Function to add an attachment
const addAttachment = async (articleId, type, url) => {
    const query = `
        INSERT INTO attachments (article_id, type, url)
        VALUES ($1, $2, $3);
    `;
    const values = [articleId, type, url];

    try {
        await pool.query(query, values);
        console.log('Attachment added successfully.');
    } catch (err) {
        console.error('Error adding attachment:', err);
    }
};

// Function to get attachments for an article
const getAttachments = async (articleId) => {
    const query = `
        SELECT * 
        FROM attachments
        WHERE article_id = $1;
    `;
    const values = [articleId];

    try {
        const res = await pool.query(query, values);
        console.log('Attachments:', res.rows);
    } catch (err) {
        console.error('Error fetching attachments:', err);
    }
};

// Example usage
// addAttachment(1, 'image', '/path/to/image1.jpg');
// getAttachments(1);