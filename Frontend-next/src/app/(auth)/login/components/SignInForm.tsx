"use client";

import { showNotificationError, showNotificationSuccess } from "@/src/@core/utils/message";
import SWTForm from "@/src/@core/component/AntD/SWTForm";
import SWTFormItem from "@/src/@core/component/AntD/SWTFormItem";
import SWTCheckbox from "@/src/@core/component/AntD/SWTCheckbox";
import Link from "next/link";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import { SWTInput, SWTInputPassword } from "@/src/@core/component/AntD/SWTInput";
import GoogleIco from "@/src/@core/component/SWTIcon/iconoir/icon/GoogleIco";
import FacebookIco from "@/src/@core/component/SWTIcon/iconoir/icon/FaceBookIco";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import http from "@/src/@core/http";

type LoginValues = {
  username: string;
  password: string;
  remember?: boolean;
};

export default function SignInForm() {
 const { login } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: LoginValues) => {
    try {
      setIsLoading(true);
      const res = await http.post("/auth/login", {
        email: values.username, // Send username as email
        password: values.password,
      });
      // API returns: { success: true, message: "Login successfully", data: { token, user } }
      const { token, user } = res.data.data;
      login(token, user);
      showNotificationSuccess("Đăng nhập thành công");
      router.push("/");
    } catch (err: any) {
      showNotificationError(err.response?.data?.message || err.message || "Đăng nhập thất bại");
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
          name="username"
          label="Tên đăng nhập"
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
        <SWTButton
          variant="outlined"
          className="w-full"
          startIcon={<GoogleIco />}
          size="sm">
          Google
        </SWTButton>
        <SWTButton
          variant="outlined"
          size="sm"
          startIcon={<FacebookIco />}
        >
          Facebook
        </SWTButton>

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