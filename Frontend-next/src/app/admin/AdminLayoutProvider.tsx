"use client";
import React, { useState, useEffect, Suspense } from "react";
import AdminLoading from "../../layout/admin/Adminloading";
import { SidebarProvider, useSidebar } from "@/src/context/SidebarContext";
import AdminHeader from "@/src/layout/admin/AdminAppHeader";
import AdminAppSideBar from "@/src/layout/admin/AdminAppSideBar";
import { ThemeProvider, useTheme } from "@/src/context/ThemeContext";
import { ConfigProvider, theme } from "antd";

const AdminLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isMobileOpen, toggleMobileSidebar } = useSidebar();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 300); // 300ms smooth splash delay for Admin panel
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <AdminLoading />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-bg-base relative transition-colors duration-500">
      <div className="hidden dark:block absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="hidden dark:block absolute bottom-[-10%] right-[-5%] w-[35%] h-[35%] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="hidden dark:block absolute top-[20%] right-[15%] w-[25%] h-[25%] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="dark:hidden absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-blue-100/50 rounded-full blur-[100px] pointer-events-none" />
      <div className="dark:hidden absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-brand-50/50 rounded-full blur-[120px] pointer-events-none" />
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      <AdminAppSideBar />
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden z-10">
        <AdminHeader />
        <main className="flex-1 w-full p-4 md:p-6 lg:px-20 lg:py-10">
          <Suspense fallback={<div className="animate-pulse bg-bg-muted rounded-2xl w-full h-full" />}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
};

const ThemedAppWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isDark } = useTheme();

  return (
    <ConfigProvider theme={{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
      <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
    </ConfigProvider>
  );
};
export default function AdminLayoutProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <ThemedAppWrapper>{children}</ThemedAppWrapper>
      </SidebarProvider>
    </ThemeProvider>
  );
}
