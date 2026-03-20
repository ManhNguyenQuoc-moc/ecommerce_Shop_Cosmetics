export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-4 p-6 rounded-2xl shadow-lg bg-white">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-brand-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
        <div className="text-center">
          <h2 className="text-base font-semibold text-gray-800">
            Đang tải trang
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Vui lòng chờ trong giây lát...
          </p>
        </div>
        <div className="flex gap-1 mt-2">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
        </div>
      </div>
    </div>
  );
}