
const Profile = () => {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
          JD
        </div>
        <div>
          <h2 className="text-2xl font-bold">John Doe</h2>
          <p className="text-gray-500">Quản trị viên hệ thống</p>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="text" disabled value="admin@example.com" className="mt-1 w-full p-2 bg-gray-50 border rounded-lg text-gray-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
          <input type="text" placeholder="0123 456 789" className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" />
        </div>
        <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
};

export default Profile;