const supabase = require('../supabaseClient');

const sendFriendRequest = async (senderEmail, receiverEmail) => {
    try {
        // Get the current timestamp in ISO format
        const createdAt = new Date().toISOString();
        console.log(senderEmail, receiverEmail);
        const { data, error } = await supabase
            .from('friend_requests')
            .insert([{ sender_email: senderEmail, receiver_email: receiverEmail, status: 'pending', created_at: createdAt  }])
            .single();

        
        if (error) {
            console.log(error);
            throw error;
        }

        console.log('Friend request sent:', data);
        return data;
    } catch (err) {
        console.error('Error sending friend request:', err);
        throw err;
    }
};


// Function to get sent friend requests
const getSentFriendRequests = async (userEmail) => {
    const { data, error } = await supabase
        .from('friend_requests')
        .select('*')
        .eq('sender_email', userEmail)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

// Function to get received friend requests
const getReceivedFriendRequests = async (userEmail) => {
    const { data, error } = await supabase
        .from('friend_requests')
        .select('*')
        .eq('receiver_email', userEmail)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

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

        console.log('Friend request status updated:', data);
        return data;
    } catch (err) {
        console.error('Error updating friend request status:', err);
        throw err;
    }
};

const deleteFriendRequest = async (id) => {
    try {
        const { data, error } = await supabase
            .from('friend_requests')
            .delete()
            .eq('id', id);

        if (error) {
            throw error;
        }

        console.log('Friend request deleted:', data);
        return data;
    } catch (err) {
        console.error('Error deleting friend request:', err);
        throw err;
    }
};

const getFriendRequestByEmails = async (senderEmail, receiverEmail) => {
    try {
        const { data, error } = await supabase
            .from('friend_requests')
            .select('*')
            .eq('sender_email', senderEmail)
            .eq('receiver_email', receiverEmail)
            .single(); // Use `single` to get the first matching request

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