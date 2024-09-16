import React, { createContext, useState, useContext, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; // Corrected import
import { loginUser, getUser } from '../api';

// Create Context
const AppContext = createContext();

// Context Provider Component
export const ContextProvider = ({ children }) => {
    const [userProfile, setUserProfile] = useState(null);
    const [otherProfile, setOtherProfile] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [messageContact, setMessageContact] = useState(null)
    const [loading, setLoading] = useState(true);

    const fetchUserData = async (email) => {
        try {
            const userData = await getUser(email);  // Fetch user profile
            setUser(userData);  // Set user data to state
            setIsLoggedIn(true); // Set login state
        } catch (error) {
            console.error('Error fetching user:', error);
            setIsLoggedIn(false);
        } finally {
            setLoading(false);  // Finished loading
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');  // Check if token exists in localStorage
        if (token) {
            try {
                const decodedUser = jwtDecode(token);  // Decode the token
                fetchUserData(decodedUser.email);  // Fetch user data based on email
            } catch (error) {
                console.error('Error decoding token:', error);
                setIsLoggedIn(false);
                setLoading(false);  // Stop loading
            }
        } else {
            setIsLoggedIn(false);
            setLoading(false);  // Stop loading
        }
    }, []);  // Run this effect only once on mount

    const logIn = async (email, password) => {
        try {
            const response = await loginUser(email, password);
            const token = response.token;

            if (token) {
                const decodedUser = jwtDecode(token);
                setIsLoggedIn(true);
                await fetchUserData(decodedUser.email);
            } else {
                throw new Error('Token not found in localStorage.');
            }
        } catch (error) {
            throw new Error('Login failed: ' + error.message);
        }
    };

    const logOut = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsLoggedIn(false);
    };

    const value = {
        userProfile,
        setUserProfile,
        isAdmin,
        setIsAdmin,
        otherProfile,
        setOtherProfile,
        user,
        setUser,
        isLoggedIn,
        logIn,
        logOut,
        messageContact,
        setMessageContact,
        loading,
        setLoading
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

// Custom hook to use the AppContext in components
export const useAppContext = () => useContext(AppContext);
