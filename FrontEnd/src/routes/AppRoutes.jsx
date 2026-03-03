import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

import HomePage from '../pages/customer/HomePage/HomePage.jsx';
import Products from '../pages/customer/Products/Products.jsx';
import Profile from '../pages/customer/Profile/Profile.jsx';
import LoginPage from '../pages/auth/LoginPage/page.jsx';
import RegisterPage from '../pages/auth/RegistrationPage/page.jsx';
import NotFound from '../pages/NotFound.jsx';
const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="/" element={<HomePage />} />

                <Route path="products" element={<Products />} />
                <Route path="profile" element={<Profile />} />
                <Route path="dashboard" element={<HomePage />} />
            </Route>
            <Route element={<AuthLayout />}>
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;