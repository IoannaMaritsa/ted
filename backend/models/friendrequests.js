const supabase = require('../supabaseClient');

const sendFriendRequest = async (senderEmail, receiverEmail) => {
    try {
        // Get the current timestamp in ISO format
        const createdAt = new Date().toISOString();
        const { data, error } = await supabase
            .from('friend_requests')
            .insert([{ sender_email: senderEmail, receiver_email: receiverEmail, status: 'pending', created_at: createdAt  }])
            .single();

        
        if (error) {
            console.error(error);
            throw error;
        }

        return data;
    } catch (err) {
        console.error('Error sending friend request:', err);
        throw err;
    }
};


// Get sent friend requests
const getSentFriendRequests = async (userEmail) => {
    const { data, error } = await supabase
        .from('friend_requests')
        .select('*')
        .eq('sender_email', userEmail)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

// Get received friend requests
const getReceivedFriendRequests = async (userEmail) => {
    const { data, error } = await supabase
        .from('friend_requests')
        .select('*')
        .eq('receiver_email', userEmail)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

// Update friend request status
const updateFriendRequestStatus = async (id, newStatus) => {
    try {
        const { data, error } = await supabase
            .from('friend_requests')
            .update({ status: newStatus })
            .eq('id', id)
            .single();

        if (error) {
            throw error;
        }

        return data;
    } catch (err) {
        console.error('Error updating friend request status:', err);
        throw err;
    }
};

// Delete friend request
const deleteFriendRequest = async (id) => {
    try {
        const { data, error } = await supabase
            .from('friend_requests')
            .delete()
            .eq('id', id);

        if (error) {
            throw error;
        }

        return data;
    } catch (err) {
        console.error('Error deleting friend request:', err);
        throw err;
    }
};


// Get friend request by sender and receiver emails
const getFriendRequestByEmails = async (senderEmail, receiverEmail) => {
    try {
        const { data, error } = await supabase
            .from('friend_requests')
            .select('*')
            .eq('sender_email', senderEmail)
            .eq('receiver_email', receiverEmail)
            .single();

        if (error) {
            throw error;
        }

        return data;
    } catch (err) {
        console.error('Error getting friend request by emails:', err);
        throw err;
    }
};





module.exports = {
    sendFriendRequest,
    getSentFriendRequests,
    getReceivedFriendRequests,
    updateFriendRequestStatus,
    deleteFriendRequest,
    getFriendRequestByEmails
};