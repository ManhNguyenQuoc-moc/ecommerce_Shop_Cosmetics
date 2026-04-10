"use client";

import React, { useState } from "react";
import { showNotificationError, showNotificationSuccess } from "@/src/@core/utils/message";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SWTForm from "@/src/@core/component/AntD/SWTForm";
import SWTFormItem from "@/src/@core/component/AntD/SWTFormItem";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import { SWTInput, SWTInputPassword } from "@/src/@core/component/AntD/SWTInput";
import GoogleIco from "@/src/@core/component/SWTIcon/iconoir/icon/GoogleIco";
import FacebookIco from "@/src/@core/component/SWTIcon/iconoir/icon/FaceBookIco";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/src/@core/utils/supabase";
import { authService } from "@/src/services/customer/auth.service";

export default function RegisterForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (values: any) => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase.auth.signUp({
                email: values.email,
                password: values.password,
                options: {
                    data: {
                        full_name: values.fullName,
                        phone: values.phone,
                    }
                }
            });

            if (error) throw error;


            try {
                await authService.registerAsync({
                    id: data.user?.id,
                    email: values.email,
                    fullName: values.fullName,
                    phone: values.phone
                });
            } catch (backendError) {
                console.warn("Backend registration sync skipped or failed:", backendError);
            }
            if (data.user && !data.session) {
                showNotificationSuccess("Đăng ký thành công. Vui lòng kiểm tra email của bạn để kích hoạt tài khoản!");
                router.push("/login?verify=sent");
            } else if (data.session) {
                showNotificationSuccess("Đăng ký thành công! Chào mừng bạn.");
                router.push("/");
            }
        } catch (err: any) {
            console.error("Registration error:", err);
            showNotificationError(err.message || "Đăng ký thất bại. Vui lòng thử lại!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                    Đăng ký tài khoản
                </h2>
                <p className="text-gray-500 mt-2">
                    Gia nhập cộng đồng làm đẹp của chúng tôi
                </p>
            </div>

            <SWTForm onFinish={handleSubmit} loading={isLoading} layout="vertical">
                <SWTFormItem
                    name="fullName"
                    label="Họ và tên"
                    rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
                >
                    <SWTInput placeholder="Họ và tên đầy đủ" className="h-11 rounded-xl" />
                </SWTFormItem>

                <SWTFormItem
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: "Vui lòng nhập email" },
                        { type: "email", message: "Email không hợp lệ" }
                    ]}
                >
                    <SWTInput placeholder="Địa chỉ email của bạn" className="h-11 rounded-xl" />
                </SWTFormItem>
                <SWTFormItem
                    name="phone"
                    label="Số điện thoại"
                    rules={[
                        { required: true, message: "Vui lòng nhập số điện thoại" },
                        { pattern: /^0\d{9,10}$/, message: "Số điện thoại không hợp lệ" }
                    ]}
                >
                    <SWTInput placeholder="Số điện thoại cá nhân" className="h-11 rounded-xl" />
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
                        placeholder="Mật khẩu bảo mật"
                        className="h-11 rounded-xl"
                        iconRender={(visible) => visible ? <Eye size={18} /> : <EyeOff size={18} />}
                    />
                </SWTFormItem>

                <SWTButton
                    htmlType="submit"
                    size="lg"
                    className="w-full py-4 text-lg !text-white !bg-brand-500 hover:!bg-brand-600 !border-none rounded-xl mt-4"
                >
                    Tạo tài khoản
                </SWTButton>

                <div className="flex items-center my-6">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <p className="px-4 text-sm text-gray-400 whitespace-nowrap uppercase tracking-wider">
                        Hoặc
                    </p>
                    <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                <div className="flex items-center gap-4">
                    <SWTButton variant="outlined" className="w-full h-11 rounded-xl" startIcon={<GoogleIco />} size="sm">
                        Google
                    </SWTButton>
                    <SWTButton variant="outlined" className="w-full h-11 rounded-xl" size="sm" startIcon={<FacebookIco />}>
                        Facebook
                    </SWTButton>
                </div>
            </SWTForm>

            <p className="text-center text-sm text-gray-600 mt-10">
                Đã có tài khoản?{" "}
                <Link href="/login" className="text-brand-500 hover:text-brand-600 font-bold transition-colors">
                    Đăng nhập ngay
                </Link>
            </p>
        </div>
    );
}
