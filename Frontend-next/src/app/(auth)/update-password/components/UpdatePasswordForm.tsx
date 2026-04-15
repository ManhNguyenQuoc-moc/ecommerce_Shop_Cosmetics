"use client";

import React, { useState, useEffect } from "react";
import { showNotificationError, showNotificationSuccess } from "@/src/@core/utils/message";
import SWTForm from "@/src/@core/component/AntD/SWTForm";
import SWTFormItem from "@/src/@core/component/AntD/SWTFormItem";
import { SWTInputPassword } from "@/src/@core/component/AntD/SWTInput";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/@core/utils/supabase";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function UpdatePasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if we have a session (the hash fragment should have been processed by Supabase)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        showNotificationError("Phiên làm việc đã hết hạn hoặc không hợp lệ. Vui lòng yêu cầu lại.");
        router.push("/forgot-password");
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (values: any) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) throw error;

      showNotificationSuccess("Cập nhật mật khẩu thành công! Vui lòng đăng nhập lại.");
      
      // Sign out to force re-login with new password
      await supabase.auth.signOut();
      
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      showNotificationError(err.message || "Không thể cập nhật mật khẩu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Đặt lại mật khẩu</h2>
        <p className="text-gray-500 mt-2">
          Vui lòng nhập mật khẩu mới của bạn bên dưới.
        </p>
      </div>

      <SWTForm onFinish={handleSubmit} loading={isLoading} layout="vertical">
        <SWTFormItem
          name="password"
          label="Mật khẩu mới"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu mới" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" }
          ]}
        >
          <SWTInputPassword
            placeholder="Nhập mật khẩu mới"
            className="h-12 rounded-xl"
            prefix={<Lock size={18} className="text-gray-400 mr-2" />}
            iconRender={(visible) => visible ? <Eye size={18} /> : <EyeOff size={18} />}
          />
        </SWTFormItem>

        <SWTFormItem
          name="confirmPassword"
          label="Xác nhận mật khẩu"
          dependencies={['password']}
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Mật khẩu xác nhận không khớp"));
              },
            }),
          ]}
        >
          <SWTInputPassword
            placeholder="Xác nhận mật khẩu mới"
            className="h-12 rounded-xl"
            prefix={<Lock size={18} className="text-gray-400 mr-2" />}
            iconRender={(visible) => visible ? <Eye size={18} /> : <EyeOff size={18} />}
          />
        </SWTFormItem>

        <SWTButton
          htmlType="submit"
          className="w-full h-12 rounded-xl !bg-brand-500 hover:!bg-brand-600 !border-none !text-white mt-4"
          loading={isLoading}
        >
          Cập nhật mật khẩu
        </SWTButton>
      </SWTForm>
    </div>
  );
}
