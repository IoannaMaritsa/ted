import React from "react";
import {
  getAllUsers,
  getAllArticles,
  getArticleInterests,
  getComments,
  getArticleViewsByArticle,
} from "../api";

const MatrixFactorizationArticles = async () => {
   // Function to get the total number of views for a specific user and article
   const getUserViewCountForArticle = (userEmail, articleId) => {
    const userViews = viewsMap[articleId].filter(view => view.user_email === userEmail);
    return userViews.reduce((total, view) => total + view.view_count, 0); // Sum the counts
  };


  try {
    const users = await getAllUsers();
    const articles = await getAllArticles();
    const otherArticles = articles.othersarticles;

    // Check if articles exist
    if (!otherArticles || otherArticles.length === 0) {
      console.error("No articles found");
      return;
    }

    // Fetch all article interests concurrently
    const articleInterestsPromises = otherArticles.map((article) =>
      getArticleInterests(article.id)
    );

    const allInterests = await Promise.all(articleInterestsPromises);

    // Fetch all comments concurrently
    const commentsPromises = otherArticles.map((article) =>
      getComments(article.id)
    );

    const allComments = await Promise.all(commentsPromises);

     // Fetch all comments concurrently
     const viewPromises = otherArticles.map((article) =>
        getArticleViewsByArticle(article.id)
      );
  
      const allViews = await Promise.all(viewPromises);

    const interestsMap = {};
    const commentsMap = {};
    const viewsMap = {};

    // Prepare a map of interests and comments for quick access
    otherArticles.forEach((article, index) => {
      interestsMap[article.id] = allInterests[index].map(
        (like) => like.user_email
      );
      commentsMap[article.id] = allComments[index].map(
        (comment) => comment.author_email
      );
      viewsMap[article.id] = allViews[index].map(
        (view) => view.user_email
      );
      
    });

    // Create a matrix for users
    const matrix = users.map((user) => {
      const row = new Array(otherArticles.length).fill(0); // Initialize row with zeros

      // Check user interests and comments for each article
      otherArticles.forEach((article) => {
        // Check if the current user has liked this article
        let hasLiked = false;
        let hasCommented = false;
        if (interestsMap[article.id].includes(user.email)) {
          row[article.id-1] += 3; // Assuming 3 if liked
          hasLiked = true;
        }

        // Check if the current user has commented on this article
        if (commentsMap[article.id].includes(user.email)) {
          row[article.id-1] += 5; // Assuming 5 if commented
          hasCommented = true;
        }

         // Increment for views based on actual view counts
        const userViewCount = viewsMap[article.id].filter(view => view.user_email === user.email);
        if (userViewCount.length > 0) {
          row[article.id - 1] += userViewCount.reduce((total, view) => total + view.view_count, 0);
        }
      });

      return { user: user.email, row }; // Include user info with the row
    });

    console.log("Matrix:", matrix);
  } catch (err) {
    console.error("Error:", err); // Log the error for debugging
  }
};

// Call the function immediately (could be done on button click or any event)
MatrixFactorizationArticles();

export default MatrixFactorizationArticles;
