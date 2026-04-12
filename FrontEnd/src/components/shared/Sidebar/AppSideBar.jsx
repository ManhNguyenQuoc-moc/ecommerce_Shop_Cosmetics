import { Link, useLocation } from 'react-router-dom';

const AppSideBar = ({ isOpen }) => {
    const location = useLocation(); // Lấy đường dẫn hiện tại

    // Hàm kiểm tra xem link có đang active không
    const isActive = (path) => location.pathname === path;

    const menuItems = [
        { path: '/', label: 'Dashboard', icon: '📊' },
        { path: '/products', label: 'Sản phẩm', icon: '📦' },
        { path: '/settings', label: 'Cài đặt', icon: '⚙️' },
    ];

    return (
        <aside className={`
      fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300
      bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      lg:translate-x-0 lg:static lg:inset-0
    `}>
            <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-slate-800">
                <span className="text-xl font-black text-brand-primary">MY LOGO</span>
            </div>

            <nav className="mt-5 px-4 space-y-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`
                                flex items-center p-3 rounded-xl transition-all duration-200
                                ${isActive(item.path)
                                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-bold'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'}
            `}
                    >
                        <span>{item.icon}</span>
                        <span className="ml-3">{item.label}</span>
                    </Link>
                ))}
            </nav>
        </aside>
    );
};

export default AppSideBar;