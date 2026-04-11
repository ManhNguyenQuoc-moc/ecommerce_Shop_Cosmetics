"use client";

import React from "react";

export const SWTLoading = () => {
    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div className="relative flex items-center justify-center">
                <div className="h-10 w-10 rounded-full border-4 border-slate-100 border-t-brand-500 animate-spin" />
            </div>
            <p className="mt-4 text-sm font-medium text-slate-400 animate-pulse">
                Đang tải dữ liệu...
            </p>
        </div>
    );
};
