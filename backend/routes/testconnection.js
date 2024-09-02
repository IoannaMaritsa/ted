// testArticles.js
const {
  addArticle,
  getArticlesByUserId,
  deleteArticleById,
  addInterest,
  removeInterest,
  getUserInterests
} = require('./articles');

const runTests = async () => {
  try {
      // Test adding an article
   
      
      // Test getting articles by user ID
      console.log('Testing getArticlesByUserId...');
      const articlesByUser = await getArticlesByUserId(1);
      console.log('Articles by user ID 1:', articlesByUser);
      
      // Test adding an interest
 

      // Test getting user interests
      console.log('Testing getUserInterests...');
      const userInterests = await getUserInterests(2);
      console.log('User interests for user ID 2:', userInterests);

      // Test removing an interest
      console.log('Testing removeInterest...');
      await removeInterest(2, 1);

      // Test deleting an article by ID
      console.log('Testing deleteArticleById...');
      const deleteResult = await deleteArticleById(1); // Assuming article with ID 1 exists
      console.log('Delete result:', deleteResult);

  } catch (error) {
      console.error('Error during tests:', error);
  } finally {
      // Close the pool to end the process
      pool.end();
  }
};

runTests();
