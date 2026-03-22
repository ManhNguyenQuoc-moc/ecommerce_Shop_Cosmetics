"use client";
import React from "react";
import { SidebarProvider, useSidebar } from "@/src/context/SidebarContext";
import AdminHeader from "@/src/layout/admin/AdminAppHeader";
import AdminAppSideBar from "@/src/layout/admin/AdminAppSideBar";

const AdminLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isMobileOpen, toggleMobileSidebar } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}
      
      <AdminAppSideBar />
      
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <AdminHeader />
        
        <main className="flex-1 w-full mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
          {children}
        </main>
      </div>
    </div>
  );
};

export default function AdminLayoutProvider({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
    </SidebarProvider>
  );
}
