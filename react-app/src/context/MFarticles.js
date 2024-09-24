import { useState, useEffect } from "react";
import { getArticleViewsByUser, getAllUsers , getAllArticles, getArticleInterests} from "../api";


const MatrixFactorizationArticles = () => {
    

    const createMatrix = async () => {
        try {
            const users = await getAllUsers();
            const articles = await getAllArticles();

            let matrix = [];
            let numofarticles = articles.length;
            await Promise.all(users.map(async (user) => {
                console.log(user.email, "h")
                const views = await getArticleViewsByUser(user.email);
                console.log(views)
                const row = [];

                for(let j=0; j<articles.length; ++j) {
                    const likedBy = await getArticleInterests(articles[j].id);
                    console.log("liked by:",likedBy);

                }

            }));

        } catch(err) {

        };
    }
    createMatrix();
}

export default MatrixFactorizationArticles;