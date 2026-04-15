"use client";

import React, { useState } from "react";
import { showNotificationError, showNotificationSuccess } from "@/src/@core/utils/message";
import SWTForm from "@/src/@core/component/AntD/SWTForm";
import SWTFormItem from "@/src/@core/component/AntD/SWTFormItem";
import { SWTInputPassword } from "@/src/@core/component/AntD/SWTInput";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import { supabase } from "@/src/@core/utils/supabase";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function ChangePasswordForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      setIsLoading(true);

      // Supabase's updateUser handles password changes for currently logged in users
      const { error } = await supabase.auth.updateUser({
        password: values.newPassword,
      });

      if (error) throw error;

      showNotificationSuccess("Đổi mật khẩu thành công!");
      
      // We don't necessarily need to sign out here unless required by business logic
      // But it's good practice to clear the form
    } catch (err: any) {
      showNotificationError(err.message || "Không thể đổi mật khẩu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ShieldCheck className="text-brand-500" />
          Đổi mật khẩu
        </h2>
        <p className="text-gray-500 mt-2">
          Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu với người khác.
        </p>
      </div>

      <SWTForm onFinish={handleSubmit} loading={isLoading} layout="vertical" className="max-w-md">
        <SWTFormItem
          name="newPassword"
          label="Mật khẩu mới"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu mới" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" }
          ]}
        >
          <SWTInputPassword
            placeholder="Nhập mật khẩu mới"
            className="h-11 rounded-lg"
            prefix={<Lock size={18} className="text-gray-400 mr-2" />}
            iconRender={(visible) => visible ? <Eye size={18} /> : <EyeOff size={18} />}
          />
        </SWTFormItem>

        <SWTFormItem
          name="confirmPassword"
          label="Xác nhận mật khẩu mới"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Mật khẩu xác nhận không khớp"));
              },
            }),
          ]}
        >
          <SWTInputPassword
            placeholder="Xác nhận mật khẩu mới"
            className="h-11 rounded-lg"
            prefix={<Lock size={18} className="text-gray-400 mr-2" />}
            iconRender={(visible) => visible ? <Eye size={18} /> : <EyeOff size={18} />}
          />
        </SWTFormItem>

        <SWTButton
          htmlType="submit"
          className="w-full h-11 rounded-lg !bg-brand-500 hover:!bg-brand-600 !border-none !text-white mt-4"
          loading={isLoading}
        >
          Lưu thay đổi
        </SWTButton>
      </SWTForm>
    </div>
  );
}
