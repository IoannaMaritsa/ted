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

    const fetchUserData = async (email) => {
        try {
            const userData = await getUser(email);
            console.log('User Data:', userData);
            setUser(userData);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                console.log('Decoded user email:', decodedUser.email);
                setIsLoggedIn(true);
                fetchUserData(decodedUser.email);
            } catch (error) {
                console.error('Error decoding token:', error);
                setIsLoggedIn(false);
            }
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const logIn = async (email, password) => {
        try {
            await loginUser(email, password);
            const token = localStorage.getItem('token');
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
        isLoggedIn,
        logIn,
        logOut,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

// Custom hook to use the AppContext in components
export const useAppContext = () => useContext(AppContext);
