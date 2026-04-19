"use client";

import React, { useState } from "react";
import { showNotificationError, showNotificationSuccess } from "@/src/@core/utils/message";
import SWTForm from "@/src/@core/component/AntD/SWTForm";
import SWTFormItem from "@/src/@core/component/AntD/SWTFormItem";
import { SWTInput } from "@/src/@core/component/AntD/SWTInput";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { authService } from "@/src/services/auth/auth.service";

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const getForgotPasswordErrorMessage = (err: unknown): string => {
    if (!(err instanceof Error)) {
      return "Không thể gửi yêu cầu khôi phục";
    }

    const rawMessage = err.message || "";
    const normalized = rawMessage.toLowerCase();

    if (normalized.includes("email rate limit exceeded")) {
      return "Bạn thao tác quá nhanh. Vui lòng chờ ít phút rồi thử gửi lại email khôi phục.";
    }

    return rawMessage;
  };

  const handleSubmit = async (values: { email: string }) => {
    try {
      setIsLoading(true);
      await authService.requestPasswordRecovery({ email: values.email.trim() });

      setIsSent(true);
      showNotificationSuccess("Yêu cầu đã được gửi! Vui lòng kiểm tra email của bạn.");
    } catch (err: any) {
      showNotificationError(getForgotPasswordErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl text-center">
        <div className="w-16 h-16 bg-brand-50 text-brand-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
        <p className="text-gray-500 mb-8">
          Chúng tôi đã gửi hướng dẫn khôi phục mật khẩu vào email của bạn.
        </p>
        <Link href="/login">
          <SWTButton className="w-full h-12 rounded-xl bg-brand-500! hover:bg-brand-600! border-none! text-white!">
            Quay lại đăng nhập
          </SWTButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
      <Link 
        href="/login" 
        className="inline-flex items-center text-sm text-gray-500 hover:text-brand-500 mb-8 transition-colors"
      >
        <ArrowLeft size={16} className="mr-2" />
        Quay lại đăng nhập
      </Link>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Quên mật khẩu?</h2>
        <p className="text-gray-500 mt-2">
          Đừng lo lắng, chúng tôi sẽ gửi cho bạn hướng dẫn khôi phục.
        </p>
      </div>

      <SWTForm onFinish={handleSubmit} loading={isLoading} layout="vertical">
        <SWTFormItem
          name="email"
          label="Email của bạn"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" }
          ]}
        >
          <SWTInput 
            placeholder="example@gmail.com" 
            className="h-12 rounded-xl"
            prefix={<Mail size={18} className="text-gray-400 mr-2" />}
          />
        </SWTFormItem>

        <SWTButton
          htmlType="submit"
          className="w-full h-12 rounded-xl bg-brand-500! hover:bg-brand-600! border-none! text-white! mt-4"
          loading={isLoading}
        >
          Gửi yêu cầu khôi phục
        </SWTButton>
      </SWTForm>
    </div>
  );
}
