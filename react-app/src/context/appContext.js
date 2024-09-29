import React, { createContext, useState, useContext, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; 
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
    const [logoutTimer, setLogoutTimer] = useState(null);

    const fetchUserData = async (email) => {
        try {
            const userData = await getUser(email); 
            setUser(userData); 
            setIsLoggedIn(true); 
        } catch (error) {
            console.error('Error fetching user:', error);
            setIsLoggedIn(false);
        } finally {
            setLoading(false);  
        }
    };

    const startLogoutTimer = (expirationTime) => {
        const currentTime = Date.now();
        const timeLeft = expirationTime - currentTime;

        if (logoutTimer) clearTimeout(logoutTimer);  

        const timer = setTimeout(() => {
            logOut();
        }, timeLeft);

        setLogoutTimer(timer);  
    };

    useEffect(() => {
        const token = localStorage.getItem('token');  
        if (token) {
            try {
                const decodedToken = jwtDecode(token);  
                 const expirationTime = decodedToken.exp * 1000;
                 if (Date.now() >= expirationTime) {
                     logOut();  // If token is expired, log out immediately
                 } else {
                     fetchUserData(decodedToken.email); 
                     startLogoutTimer(expirationTime);  
                 }
            } catch (error) {
                console.error('Error decoding token:', error);
                setIsLoggedIn(false);
                setLoading(false); 
            }
        } else {
            setIsLoggedIn(false);
            setLoading(false); 
        }
    }, []); 

    const logIn = async (email, password) => {
        try {
            const response = await loginUser(email, password);
            const token = response.token;

            if (token) {
                localStorage.setItem('token', token);
                const decodedUser = jwtDecode(token);
                setIsLoggedIn(true);
                await fetchUserData(decodedUser.email);

                const expirationTime = decodedUser.exp * 1000;
                startLogoutTimer(expirationTime);
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
        if (logoutTimer) clearTimeout(logoutTimer);  // Clear the timer on logout
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

export const useAppContext = () => useContext(AppContext);
