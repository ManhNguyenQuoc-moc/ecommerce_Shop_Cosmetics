// src/components/shared/Footer/AppFooter.jsx
const AppFooter = () => {
  return (
    <footer className="bg-white border-t py-4 px-6 text-center text-sm text-gray-600">
      <p>© {new Date().getFullYear()} Công ty của bạn. All rights reserved.</p>
    </footer>
  );
};

export default AppFooter;