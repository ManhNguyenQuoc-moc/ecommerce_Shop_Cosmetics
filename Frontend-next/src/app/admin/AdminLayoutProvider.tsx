"use client";
import React from "react";
import { SidebarProvider, useSidebar } from "@/src/context/SidebarContext";
import AdminHeader from "@/src/layout/admin/AdminAppHeader";
import AdminAppSideBar from "@/src/layout/admin/AdminAppSideBar";
import { ThemeProvider, useTheme } from "@/src/context/ThemeContext";
import { ConfigProvider, theme } from "antd";

const AdminLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isMobileOpen, toggleMobileSidebar } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[radial-gradient(circle_at_50%_-20%,#1e1b4b_0%,#020617_80%)] relative transition-colors duration-500">
      <div className="hidden dark:block absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-600/20 rounded-full blur-[120px] animate-float pointer-events-none" />
      <div className="hidden dark:block absolute bottom-[-10%] right-[-5%] w-[35%] h-[35%] bg-fuchsia-600/20 rounded-full blur-[120px] animate-float pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="hidden dark:block absolute top-[20%] right-[15%] w-[25%] h-[25%] bg-purple-600/20 rounded-full blur-[100px] animate-pulse pointer-events-none" style={{ animationDuration: '8s' }} />

      <div className="hidden dark:block absolute top-[10%] left-[30%] w-1.5 h-1.5 bg-pink-400 rounded-full shadow-[0_0_8px_#ff007f] animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />
      <div className="hidden dark:block absolute top-[40%] right-[20%] w-1 h-1 bg-fuchsia-400 rounded-full shadow-[0_0_8px_#d946ef] animate-pulse pointer-events-none" style={{ animationDuration: '4s' }} />
      <div className="hidden dark:block absolute bottom-[20%] left-[15%] w-2 h-2 bg-purple-400 rounded-full shadow-[0_0_10px_#a855f7] animate-ping pointer-events-none" style={{ animationDuration: '5s' }} />
      <div className="hidden dark:block absolute top-[60%] left-[5%] w-1.5 h-1.5 bg-rose-400 rounded-full shadow-[0_0_8px_#f43f5e] animate-pulse pointer-events-none" style={{ animationDuration: '6s' }} />
      <div className="dark:hidden absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-blue-400/20 rounded-full blur-[100px] animate-float pointer-events-none" />
      <div className="dark:hidden absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-brand-400/20 rounded-full blur-[120px] animate-float pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="dark:hidden absolute top-[20%] right-[15%] w-[25%] h-[25%] bg-pink-400/10 rounded-full blur-[100px] animate-pulse pointer-events-none" style={{ animationDuration: '8s' }} />
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      <AdminAppSideBar />
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden z-10">
        <AdminHeader />
        <main className="flex-1 w-full mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
          {children}
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
