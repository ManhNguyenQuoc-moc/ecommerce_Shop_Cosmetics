import ForgotPasswordForm from "./components/ForgotPasswordForm";

export const metadata = {
  title: "Quên mật khẩu | Cosmetics Shop",
  description: "Khôi phục mật khẩu tài khoản của bạn",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <ForgotPasswordForm />
    </div>
  );
}
