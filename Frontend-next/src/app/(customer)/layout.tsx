import CustomerHeader from "@/src/layout/customer/AppHeader";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-blue-light-50">
      <CustomerHeader/>
      <main className="max-w-[1250px] mx-auto p-4 ">
        {children}
      </main>
    </div>
  );
}