import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { ShopContext } from '../App';

interface AdminRouteProps {
    children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    const { user } = useContext(ShopContext);
    const ADMIN_EMAIL = 'admin@gmail.com';

    if (!user || user.email !== ADMIN_EMAIL) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};
