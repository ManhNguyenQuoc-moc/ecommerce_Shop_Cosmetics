"use client";

import RegisterForm from "./components/RegisterForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function RegisterPage() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gray-50/50">
            <div className="relative flex w-full max-w-5xl h-[700px] rounded-2xl overflow-hidden shadow-2xl bg-white">
                {/* Back to Login Link */}
                <Link
                    href="/login"
                    className="absolute top-6 left-6 z-20 inline-flex items-center text-sm font-semibold text-gray-600 hover:text-brand-500 transition-colors"
                >
                    <ChevronLeft size={20} className="mr-1" />
                    Quay lại đăng nhập
                </Link>

                {/* Left Side: Image/Branding */}
                <div className="relative hidden lg:flex w-1/2 items-center justify-center font-bold">
                    <img
                        src="/images/main/brand.jpg"
                        alt="Brand"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-12 left-12 right-12 text-white">
                        <h1 className="text-3xl font-bold mb-2">Moc Cosmetics</h1>
                        <p className="text-gray-200">Nâng niu vẻ đẹp tự nhiên của bạn với những sản phẩm chăm sóc da cao cấp.</p>
                    </div>
                </div>

                {/* Right Side: Register Form */}
                <div className="flex w-full lg:w-1/2 items-center justify-center p-8 overflow-y-auto">
                    <div className="w-full">
                        <RegisterForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
