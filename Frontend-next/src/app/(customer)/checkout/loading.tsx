export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 border-4 border-gray-300 border-t-brand-500 rounded-full animate-spin" />
        <span>Đang tải trang thanh toán...</span>
      </div>
    </div>
  );
}