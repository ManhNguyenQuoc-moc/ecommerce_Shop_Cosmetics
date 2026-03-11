import AdminHeader from "@/src/layout/admin/AdminAppHeader";
import AdminAppSideBar from "@/src/layout/admin/AdminAppSideBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-blue-light-50">
      <AdminAppSideBar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 max-w-[1250px] w-full mx-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}