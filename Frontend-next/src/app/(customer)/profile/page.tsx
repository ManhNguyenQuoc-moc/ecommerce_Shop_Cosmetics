export default function ProfilePage() {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">
        Thông tin cá nhân
      </h1>

      <div className="space-y-4">

        <div>
          <p className="text-sm text-gray-500">Họ tên</p>
          <p className="font-medium">Nguyễn Văn A</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium">example@gmail.com</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Số điện thoại</p>
          <p className="font-medium">0123456789</p>
        </div>

      </div>
    </div>
  );
}