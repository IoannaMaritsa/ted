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

// Example usage
// addArticle('New Article Title', 1, '2024-08-20', 'This is the content of the new article.');