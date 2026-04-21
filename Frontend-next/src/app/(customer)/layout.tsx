import HeaderContainer from "@/src/layout/customer/HeaderContainer";
import AppFooter from "@/src/layout/customer/AppFooter";
import BackgroundDecor from "@/src/layout/customer/BackgroundDecor";
import type { Metadata } from "next";
import { getServerCategories, getServerBrands } from "@/src/services/customer/home/customer.service";
import ThemeForceLight from "@/src/@core/component/Theme/ThemeForceLight";
import HeaderActionButtons from "@/src/layout/customer/HeaderActionButtons";

export const metadata: Metadata = {
  title: "Cosmetics Shop - Trang chủ",
  description: "Chuyên cung cấp các dòng mỹ phẩm chính hãng, chăm sóc da và làm đẹp với giá tốt nhất.",
};

// Server component that fetches header data
async function HeaderDataWrapper() {
  const [categories, brands] = await Promise.all([
    getServerCategories(),
    getServerBrands()
  ]);

  return (
    <HeaderContainer
      initialCategories={categories || []}
      initialBrands={brands || []}
    >
      {/* Pass only action buttons as children - AppHeader handles responsive layout */}
      <HeaderActionButtons />
    </HeaderContainer>
  );
}

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <ThemeForceLight />
      <BackgroundDecor />
      <div className="relative z-10 flex flex-col min-h-screen">
        <HeaderDataWrapper />
        {/* Mobile search bar was fixed positioned, now inline - removed this gap */}

        <main className="flex-1 min-h-[62vh] max-w-7xl mx-auto px-4 md:px-6 py-8 w-full">
          {children}
        </main>

        <AppFooter />
      </div>
    </div>
  );
}