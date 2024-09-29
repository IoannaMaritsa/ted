const supabase = require('../supabaseClient');

// Add a view to a article
async function addViewtoArticle(userEmail, articleId) {
    try {
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

        }

    } catch (error) {
        console.error('Error adding view to article:', error);
        throw error;
    }
}

// Get article views of a user
const getArticleViewsByUser = async (userEmail) => {
    try {
        const { data: userViews, error: userViewsError } = await supabase
            .from('article_views')
            .select('*')
            .eq('user_email', userEmail);

        if (userViewsError) {
            throw userViewsError;
        }

        return userViews;

    } catch (error) {
        console.error('Error fetching views for user:', error);
        throw error;
    }
}

// Get article views of an article
const getArticleViewsByArticle = async (articleId) => {
    try {
        const { data: userViews, error: userViewsError } = await supabase
            .from('article_views')
            .select('*')
            .eq('article_id', articleId);

        if (userViewsError) {
            throw userViewsError;
        }

        return userViews;

    } catch (error) {
        console.error('Error fetching views for user:', error);
        throw error;
    }
}

// Get article views of a user
const getArticleViews = async () => {
    try {
        const { data: userViews, error: userViewsError } = await supabase
            .from('article_views')
            .select('*')
        if (userViewsError) {
            throw userViewsError;
        }

        return userViews;

    } catch (error) {
        console.error('Error fetching views for user:', error);
        throw error;
    }
}

module.exports = {
    addViewtoArticle,
    getArticleViewsByUser,
    getArticleViewsByArticle,
    getArticleViews
};