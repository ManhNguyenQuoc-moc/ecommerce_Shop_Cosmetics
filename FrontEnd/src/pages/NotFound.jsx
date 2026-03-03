// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <h1 className="text-9xl font-black text-brand-primary opacity-20">404</h1>
      <div className="absolute flex flex-col items-center">
        <h2 className="text-3xl font-bold mt-4">Ối! Trang không tồn tại</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Có vẻ như đường dẫn bạn đang truy cập đã bị đổi hoặc không tồn tại.
        </p>
        <Link 
          to="/" 
          className="mt-6 px-6 py-3 bg-brand-primary text-white rounded-xl font-bold shadow-lg hover:bg-brand-secondary transition-all"
        >
          Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
};

export default NotFound;