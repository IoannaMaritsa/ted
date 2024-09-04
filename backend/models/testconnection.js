const { addArticle, getArticlesByUserId, deleteArticleById } = require('./articles');

// Test the getArticlesByUserId function
const testGetArticlesByUserId = async () => {
    try {
        const articles = await getArticlesByUserId(40);  // Assuming 1 is a valid user ID
        console.log('Articles for User 1:', articles);
    } catch (err) {
        console.error('Error in testGetArticlesByUserId:', err);
    }
};


// Run all tests
const runTests = async () => {
    await testGetArticlesByUserId();
};

runTests();