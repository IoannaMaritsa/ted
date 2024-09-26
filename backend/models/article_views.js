const supabase = require('../supabaseClient');

// Function to add a view to a article
async function addViewtoArticle(userEmail, articleId) {
    try {
        // Check if the view already exists
        const { data: view, error: viewError } = await supabase
            .from('article_views')
            .select('*')
            .eq('user_email', userEmail)
            .eq('article_id', articleId)
            .limit(1);

        if (viewError) {
            throw viewError;
        }

        if (view && view.length>0) {
            // Increment the count if the view already exists
            const newView = {
                count: view[0].count + 1,
            };
            console.log('newcount', newView);

            const { data, error } = await supabase
                .from('article_views')
                .update(newView)
                .eq('user_email', userEmail)
                .eq('article_id', articleId)
                .single();

            if (error) {
                throw error;
            }

        } else {
            // Insert a new view if it does not exist
            const { error: articleViewError } = await supabase
                .from('article_views')
                .upsert({ user_email: userEmail, article_id: articleId, count: 1 }, { onConflict: ['user_email', 'article_id'] });

            if (articleViewError) {
                throw articleViewError;
            }

            console.log(`View added to article ID ${articleId}`);
        }

    } catch (error) {
        console.error('Error adding view to article:', error);
        throw error; // Optional: re-throw error for further handling
    }
}

// Function to get article views of a user
const getArticleViewsByUser = async (userEmail) => {
    try {
        // Fetch views associated with the user
        const { data: userViews, error: userViewsError } = await supabase
            .from('article_views')
            .select('*')
            .eq('user_email', userEmail);

            console.log(userEmail, userViews)
        if (userViewsError) {
            throw userViewsError;
        }

        console.log(userViews)
        if (!userViews || userViews.length === 0) {
    
            return []; // No views found for the user
        }

        return userViews;

    } catch (error) {
        console.error('Error fetching views for user:', error);
        throw error;
    }
}

module.exports = {
    addViewtoArticle,
    getArticleViewsByUser
};