// src/layouts/MainLayout.jsx
import { Outlet } from 'react-router-dom'; // 1. Import Outlet
import AppHeader from '../components/shared/Header';
import AppSideBar from '../components/shared/Sidebar/AppSideBar';
import AppFooter from '../components/shared/Footer';
import { useState } from 'react';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    return (
        <div className="flex min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
            <AppSideBar isOpen={isSidebarOpen} />
            <div className="flex-1 flex flex-col min-w-0">
                <AppHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 p-6 bg-gray-50 dark:bg-slate-900/50">
                    <div className="max-w-7xl mx-auto">
                        <Outlet/>
                    </div>
                </main>
                <AppFooter />
            </div>
        </div>
    );
};

export default AdminLayout;