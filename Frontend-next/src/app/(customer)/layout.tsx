import CustomerHeader from "@/src/layout/customer/AppHeader";
import AppFooter from "@/src/layout/customer/AppFooter";
import BackgroundDecor from "@/src/layout/customer/BackgroundDecor";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <BackgroundDecor />
      <div className="relative z-10 flex flex-col min-h-screen">
        <CustomerHeader />
        <main className="flex-1 max-w-7xl mx-auto px-4 md:px-6 py-8 w-full">
          {children}
        </main>
        <AppFooter />
      </div>
    </div>

  );
}