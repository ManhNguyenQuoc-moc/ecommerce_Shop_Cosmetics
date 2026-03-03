
import React from 'react';

const Dashboard = () => {
  const stats = [
    { label: 'Người dùng mới', value: '1,250', color: 'bg-blue-500' },
    { label: 'Doanh thu', value: '$50,000', color: 'bg-green-500' },
    { label: 'Đơn hàng', value: '320', color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Bảng điều khiển</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
            <p className="text-2xl font-bold mt-2 text-gray-900">{stat.value}</p>
            <div className={`h-1 w-12 mt-4 ${stat.color} rounded-full`}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;