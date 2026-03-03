const Products = () => {
  const products = [
    { id: 1, name: 'iPhone 15 Pro', price: '$999', status: 'Còn hàng' },
    { id: 2, name: 'MacBook Air M3', price: '$1,199', status: 'Hết hàng' },
    { id: 3, name: 'iPad Pro', price: '$799', status: 'Còn hàng' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Danh sách sản phẩm</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          + Thêm mới
        </button>
      </div>
      <table className="w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-sm font-semibold text-gray-600">ID</th>
            <th className="px-6 py-3 text-sm font-semibold text-gray-600">Tên sản phẩm</th>
            <th className="px-6 py-3 text-sm font-semibold text-gray-600">Giá</th>
            <th className="px-6 py-3 text-sm font-semibold text-gray-600">Trạng thái</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4">#{p.id}</td>
              <td className="px-6 py-4 font-medium">{p.name}</td>
              <td className="px-6 py-4">{p.price}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs ${p.status === 'Còn hàng' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {p.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;