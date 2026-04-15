import UpdatePasswordForm from "./components/UpdatePasswordForm";

export const metadata = {
  title: "Đặt lại mật khẩu | Cosmetics Shop",
  description: "Cập nhật mật khẩu mới cho tài khoản của bạn",
};

export default function UpdatePasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <UpdatePasswordForm />
    </div>
  );
}
