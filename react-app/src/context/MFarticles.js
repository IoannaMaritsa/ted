import React from "react";
import {
  getAllUsers,
  getAllArticles,
  getAllInterests,
  getAllComments,
  getArticleViews,
} from "../api";

const MatrixFactorizationArticles = async () => {
 
  try {
    const users = await getAllUsers();
    const articles = (await getAllArticles()).othersarticles;
    const views = await getArticleViews();
    const comments = await getAllComments();
    const interests = await getAllInterests();

    const createUserArticleMatrix = (
      users,
      articles,
      views,
      comments,
      interests
    ) => {
      const interestsMap = {};
      const commentsMap = {};
      const viewsMap = {};

      // Prepare maps for fast look ups
      articles.forEach((article) => {
        interestsMap[article.id] = interests
          .filter((interest) => interest.article_id === article.id)
          .map((interest) => interest.user_email);

        commentsMap[article.id] = comments
          .filter((comment) => comment.article_id === article.id)
          .map((comment) => comment.user_email);

        viewsMap[article.id] = views
          .filter((view) => view.article_id === article.id)
          .map((view) => ({ user: view.user_email, count: view.view_count }));
      });

      const matrix = users.map((user) => {
        const row = new Array(articles.length).fill(0); // Initialize with zeros

        articles.forEach((article, index) => {
          // Calculate the engagement score
          let engagementScore = 0;

          // Add points for likes
          if (interestsMap[article.id].includes(user.email)) {
            engagementScore += 3; // +3 for like
          }

          // Add points for comments
          if (commentsMap[article.id].includes(user.email)) {
            engagementScore += 5; // +5 for comment
          }

          // Add points for views
          const userViews = viewsMap[article.id].filter(
            (view) => view.user === user.email
          );
          if (userViews.length > 0) {
            engagementScore += userViews[0].count; // Add the actual view count
          }

          // Set the engagement score for this article
          row[index] = engagementScore; // Assign the computed score
        });

        return { user: user.email, row }; // Include user info with the row
      });

      return matrix;
    };

    const matrix = createUserArticleMatrix(
      users,
      articles,
      views,
      comments,
      interests
    );

    function matrixFactorization(
      R,
      numFeatures = 1, 
      steps = 5000,
      alpha = 0.0002,
      beta = 0.02
    ) {
      const numUsers = R.length;
      const numArticles = R[0].row.length;

      // Initialize user (P) and article (Q) matrices with random values
      let P = Array.from({ length: numUsers }, () =>
        new Array(numFeatures).fill(0).map(() => Math.random())
      );
      let Q = Array.from({ length: numArticles }, () =>
        new Array(numFeatures).fill(0).map(() => Math.random())
      );


      // Perform Gradient Descent
      for (let step = 0; step < steps; step++) {
        for (let i = 0; i < numUsers; i++) {
          for (let j = 0; j < numArticles; j++) { 
            if (R[i].row[j] > 0) {
              // Only factorize known values
              const error = R[i].row[j] - dotProduct(P[i], Q[j]);

              for (let k = 0; k < numFeatures; k++) {
                P[i][0] += alpha * (2 * error * Q[j][0] - beta * P[i][0]); 
                Q[j][0] += alpha * (2 * error * P[i][0] - beta * Q[j][0]); 
              }
            }
          }
        }
      }
      return { P, Q };
    }


    function dotProduct(vec1, vec2) {
      return vec1[0] * vec2[0]; 
    }

    const { P, Q } = matrixFactorization(matrix);


    const predictedRatings = users.map((user, userIndex) => {
      return articles.map((article, articleIndex) => {
        return {
          user: user.email,
          articleId: article.id,

          predictedRating: dotProduct(P[userIndex], Q[articleIndex]), // Calculate predicted rating
        };
      });
    });


    return predictedRatings;
  } catch (err) {
    console.error("Error:", err);
  }
};

export default MatrixFactorizationArticles;
