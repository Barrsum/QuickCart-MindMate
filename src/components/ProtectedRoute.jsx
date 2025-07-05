// src/components/ProtectedRoute.jsx

import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { currentUser } = useAuth();

    if (!currentUser) {
        // If there is no logged-in user, redirect to the /login page
        return <Navigate to="/login" />;
    }

    // If there is a user, render the child components (the actual page)
    return children;
};

export default ProtectedRoute;