"use client";

import FormDetail from "./components/SignInForm";
import useMyTitle from "../../../hooks/useMyTitle";
import { Link } from "react-router-dom";
export default function SignIn() {
    useMyTitle("Đăng nhập");
    return (
        <div className="flex min-h-screen w-full items-center justify-center">
            <div className="relative flex w-full max-w-5xl h-[600px] rounded-xl overflow-hidden shadow-lg">
                <Link
                    to="/"
                    className=" text-white hover:text-amber-50 absolute top-4 left-4 z-20 inline-flex items-center text-sm font-medium"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Trang chủ
                </Link>
                <div className="relative hidden lg:flex w-1/2 items-center justify-center">
                    <img
                        src="/images/main/brand.jpg"
                        alt="Brand"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                </div>
                <div className="flex w-full lg:w-1/2 items-center justify-center">
                    <div className="w-full">
                        <FormDetail />
                    </div>
                </div>
            </div>
        </div>
    );
}