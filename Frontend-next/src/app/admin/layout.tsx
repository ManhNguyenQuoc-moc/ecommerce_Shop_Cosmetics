import AdminLayoutProvider from "./AdminLayoutProvider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutProvider>{children}</AdminLayoutProvider>;
}