// src/components/AdminRoute.jsx

import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const AdminRoute = ({ children }) => {
    const { currentUser, isAdmin } = useAuth();

    // Must be logged in AND be an admin
    if (!currentUser || !isAdmin) {
        // If not, redirect them to the homepage
        return <Navigate to="/" />;
    }

    return children;
};

export default AdminRoute;