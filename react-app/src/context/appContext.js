import React, { createContext, useState, useContext } from 'react';

// Create Context
const AppContext = createContext();

// Context Provider Component
export const ContextProvider = ({ children }) => {
    const [userProfile, setUserProfile] = useState(null);
    const [otherProfile, setOtherProfile] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    const value = {
        userProfile,
        setUserProfile,
        isAdmin,
        setIsAdmin,
        otherProfile,
        setOtherProfile,

    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

// Custom hook to use the AppContext in components
export const useAppContext = () => useContext(AppContext);
