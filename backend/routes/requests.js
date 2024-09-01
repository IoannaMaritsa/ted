const pool = require('../db');

//send request
const sendRequest = async (senderId, receiverId) => {
    try {
        const query = `
            INSERT INTO friend_requests (sender_id, receiver_id)
            VALUES ($1, $2)
            ON CONFLICT (sender_id, receiver_id) DO NOTHING;
        `;
        await pool.query(query, [senderId, receiverId]);
        console.log(`Friend request sent from user ${senderId} to user ${receiverId}`);
    } catch (error) {
        console.error('Error sending friend request:', error);
        throw error;
    }
};

//Accept request
const acceptFriendRequest = async (senderId, receiverId) => {
    try {
        const query = `
            UPDATE friend_requests
            SET status = 'accepted'
            WHERE sender_id = $1 AND receiver_id = $2;
        `;
        await pool.query(query, [senderId, receiverId]);
        console.log(`Friend request from user ${senderId} to user ${receiverId} accepted`);
    } catch (error) {
        console.error('Error accepting friend request:', error);
        throw error;
    }
};

//Delete request
const deleteFriendRequest = async (senderId, receiverId) => {
    try {
        const query = `
            DELETE FROM friend_requests
            WHERE sender_id = $1 AND receiver_id = $2;
        `;
        await pool.query(query, [senderId, receiverId]);
        console.log(`Friend request from user ${senderId} to user ${receiverId} deleted`);
    } catch (error) {
        console.error('Error deleting friend request:', error);
        throw error;
    }
}

//get requests sent to a user
const getFriendRequestsForUser = async (userId) => {
    try {
        const query = `
            SELECT * FROM friend_requests
            WHERE receiver_id = $1
            AND status = 'pending';
        `;
        const result = await pool.query(query, [userId]);
        console.log(result.rows);
        return result.rows;
    } catch (error) {
        console.error('Error retrieving friend requests:', error);
        throw error;
    }
}

//sendRequest(1,2);
//getFriendRequestsForUser(2);

module.exports = {
    sendRequest,
    acceptFriendRequest,
    deleteFriendRequest,
    getFriendRequestsForUser
};

