"use client";

import { useEffect, useState } from "react";

export default function Loading({ shopName = "SWT Shop" }: { shopName?: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        const increment = Math.random() * 15;
        return Math.min(prev + increment, 95);
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-md">
      
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-100">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="relative flex flex-col items-center p-8 rounded-3xl bg-white shadow-2xl shadow-slate-200/50 border border-white">
        <div className="relative flex items-center justify-center mb-8">
          {/* Vòng tròn loading bên ngoài */}
          <div className="absolute h-20 w-20 rounded-full border-[3px] border-slate-100 border-t-indigo-600 animate-spin" />
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 text-white font-bold text-xl shadow-lg">
            {shopName.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Text Area */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500">
            {shopName}
          </h2>
          <div className="flex items-center justify-center gap-1.5">
            <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.3s]"></span>
            <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.15s]"></span>
            <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-600 animate-bounce"></span>
          </div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-widest pt-2">
            Đang chuẩn bị không gian...
          </p>
        </div>

        {/* Skeleton tinh tế */}
        <div className="mt-8 w-48 space-y-2 opacity-40">
          <div className="h-2 w-full bg-slate-200 animate-pulse rounded-full" />
          <div className="h-2 w-2/3 mx-auto bg-slate-200 animate-pulse rounded-full" />
        </div>
      </div>

      {/* Footer mờ */}
      <div className="absolute bottom-10 text-slate-400 text-[10px] font-medium tracking-tighter opacity-50">
        &copy; 2024 {shopName.toUpperCase()} EXPERIENCE
      </div>
    </div>
  );
}