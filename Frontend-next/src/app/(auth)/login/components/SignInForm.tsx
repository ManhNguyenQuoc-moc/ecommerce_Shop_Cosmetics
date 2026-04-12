"use client";

import { showNotificationError, showNotificationSuccess } from "@/src/@core/utils/message";
import SWTForm from "@/src/@core/component/AntD/SWTForm";
import SWTFormItem from "@/src/@core/component/AntD/SWTFormItem";
import SWTCheckbox from "@/src/@core/component/AntD/SWTCheckbox";
import Link from "next/link";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import { SWTInput, SWTInputPassword } from "@/src/@core/component/AntD/SWTInput";
import { GoogleIcon as GoogleIco, FacebookIcon as FacebookIco } from "@/src/@core/component/AntD/Icons";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/@core/utils/supabase";
import { useAuth } from "@/src/context/AuthContext";
import { useCart } from "@/src/hooks/useCart";
type LoginFormValues = {
  email: string;
  password: string;
  remember?: boolean;
};
export default function SignInForm() {
  const { login } = useAuth();
  const { items, syncCart, setIsMerging } = useCart();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email);
      const credentials = isEmail 
        ? { email: values.email, password: values.password } 
        : { phone: values.email, password: values.password };

      const { data, error } = await supabase.auth.signInWithPassword(credentials);

      if (error) throw error;
      
      if (data.session && data.user) {
        
        const authUser = {
          id: data.user.id,
          name: data.user.user_metadata.full_name || "User",
          full_name: data.user.user_metadata.full_name,
          email: data.user.email,
          avatar: data.user.user_metadata.avatar_url,
          username: data.user.email || "",
          role: data.user.user_metadata.role || "CUSTOMER"
        };
        
        const guestItems = [...items];
        setIsMerging(true);
        try {
          await login(data.session.access_token, authUser);
          await syncCart(data.user.id, guestItems);
        } finally {
          setIsMerging(false);
        }
        showNotificationSuccess("Đăng nhập thành công! Chào mừng trở lại.");
        router.push("/");
      }
    } catch (err: any) {
      showNotificationError(err?.message || "Đăng nhập thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
        setIsLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}`,
            }
        });
        if (error) throw error;
    } catch (err: any) {
        showNotificationError(err?.message || "Lỗi đăng nhập Google");
    } finally {
        setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    try {
        setIsLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'facebook',
            options: {
                redirectTo: `${window.location.origin}`,
            }
        });
        if (error) throw error;
    } catch (err: any) {
        showNotificationError(err?.message || "Lỗi đăng nhập Facebook");
    } finally {
        setIsLoading(false);
    }
  };


  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">
          Chào mừng trở lại
        </h2>
        <p className="text-gray-500 mt-2">
          Vui lòng nhập thông tin để đăng nhập
        </p>
      </div>

      <SWTForm
        onFinish={handleSubmit} loading={isLoading} >
        <SWTFormItem
          name="email"
          label="Email hoặc số điện thoại"
          rules={[
            { required: true, message: "Vui lòng nhập email hoặc số điện thoại" },
            {
              validator(_, value) {
                if (!value) return Promise.resolve();
                const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                const isPhone = /^0\d{9,10}$/.test(value);
                if (isEmail || isPhone) return Promise.resolve();
                return Promise.reject(
                  new Error("Email hoặc số điện thoại không hợp lệ")
                );
              }
            }
          ]}
        >
        <SWTInput placeholder="Nhập email hoặc số điện thoại" showCount={false} allowClear={false} className="h-11 rounded-lg"/>
        </SWTFormItem>
        <SWTFormItem
          name="password"
          label="Mật khẩu"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" }
          ]}
        >
          <SWTInputPassword
          placeholder="Nhập mật khẩu"
          showCount={false}
          allowClear={false}
          className="h-11 rounded-lg [&_.ant-input]:bg-transparent"
          iconRender={(visible) =>
            visible ? (
              <Eye size={18} className="text-gray-400" />
            ) : (
              <EyeOff size={18} className="text-gray-400" />
            )
          }
          />
        </SWTFormItem>
        <div className="flex items-center justify-between text-sm mb-4">
          <SWTFormItem
            name="remember"
            valuePropName="checked"
            noStyle
          >
           <SWTCheckbox className="!accent-brand-500">
            Ghi nhớ đăng nhập
          </SWTCheckbox>
          </SWTFormItem>
          <a href="#" className="font-medium hover:underline">
            Quên mật khẩu?
          </a>

        </div>
        <SWTButton
          htmlType="submit"
          size="lg"
          className="w-full py-4 text-lg !text-white !bg-brand-500 hover:!bg-brand-700"
        >
          Đăng nhập
        </SWTButton>
        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <p className="px-3 text-sm text-gray-600 whitespace-nowrap">
            Hoặc đăng nhập bằng
          </p>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>
      </SWTForm>
      <div className="flex items-center text-sm gap-3 mt-4">
        {/* Google Button Wrapper */}
        <div id="google-login-btn" className="flex-1">
            <div 
                onClick={handleGoogleLogin}
                className="flex justify-center items-center w-full border border-gray-200 rounded-lg overflow-hidden py-2 hover:bg-gray-50 transition-colors cursor-pointer relative h-11"
            >
                <GoogleIco />
                <span className="ml-2 font-medium text-gray-700 hidden sm:inline">Google</span>
            </div>
        </div>

        {/* Facebook Button Wrapper */}
        <div className="flex-1">
            <SWTButton
                variant="outlined"
                className="w-full !border-gray-200 !text-gray-700 !h-11 !rounded-lg"
                startIcon={<FacebookIco />}
                onClick={handleFacebookLogin}
                loading={isLoading}
            >
                <span className="hidden sm:inline">Facebook</span>
            </SWTButton>
        </div>
      </div>

      <p className="text-center text-sm text-gray-600 mt-6">
        Chưa có tài khoản{" "}
        <Link
          href="/register"
          className="text-brand-500 hover:text-brand-600 font-bold">
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}