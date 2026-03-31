export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm z-50 transition-all duration-300">
      <div className="flex flex-col items-center gap-4 p-8 rounded-2xl shadow-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 border-[5px] border-slate-100 dark:border-slate-700 rounded-full"></div>
          <div className="absolute inset-0 border-[5px] border-t-fuchsia-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
        <div className="text-center">
          <h2 className="text-lg font-bold bg-gradient-to-r from-fuchsia-600 to-purple-600 bg-clip-text text-transparent dark:from-fuchsia-400 dark:to-purple-400">
            Đang tải hệ thống
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
            Dữ liệu đang được đồng bộ...
          </p>
        </div>
        <div className="flex gap-1.5 mt-2">
          <span className="w-2.5 h-2.5 bg-fuchsia-400 rounded-full animate-bounce shadow-[0_0_8px_rgba(232,121,249,0.5)]"></span>
          <span className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce delay-150 shadow-[0_0_8px_rgba(192,132,252,0.5)]"></span>
          <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce delay-300 shadow-[0_0_8px_rgba(129,140,248,0.5)]"></span>
        </div>
      </div>
    </div>
  );
}
