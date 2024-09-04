// ProtectedRoute.js
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAppContext } from '../context/appContext'; // Adjust path as needed

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const { isLoggedIn } = useAppContext();

    return (
        <Route
            {...rest}
            render={props =>
                isLoggedIn ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/login" />
                )
            }
        />
    );
};

export default ProtectedRoute;
