
import React from 'react';

export default function HomePage() {
  const summaryCards = [
    { title: 'Tổng doanh thu', value: '128.430.000đ', growth: '+12.5%', icon: '💰' },
    { title: 'Đơn hàng mới', value: '156', growth: '+8.2%', icon: '📦' },
    { title: 'Khách hàng', value: '2,420', growth: '+4.3%', icon: '👥' },
    { title: 'Tỷ lệ chuyển đổi', value: '3.15%', growth: '-0.5%', icon: '📈' },
  ];
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Chào buổi sáng, Admin! 👋</h1>
        <p className="text-gray-500">Dưới đây là những gì đang diễn ra với cửa hàng của bạn hôm nay.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="text-2xl">{card.icon}</div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${card.growth.startsWith('+') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {card.growth}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-sm text-gray-500 font-medium">{card.title}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800">Phân tích doanh thu</h3>
            <select className="text-sm border-none bg-gray-50 rounded-lg p-1 outline-none">
              <option>7 ngày qua</option>
              <option>30 ngày qua</option>
            </select>
          </div>
          <div className="h-64 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400">
            [Biểu đồ doanh thu sẽ hiển thị ở đây]
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6">Thông báo mới</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
                  <span className="text-xs font-bold">NEW</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Đơn hàng #1234 vừa được thanh toán</p>
                  <p className="text-xs text-gray-400 mt-1">2 phút trước</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-xl transition">
            Xem tất cả
          </button>
        </div>

      </div>
    </div>
  );
};