import CustomerHeader from "@/src/layout/customer/AppHeader";
import AppFooter from "@/src/layout/customer/AppFooter";
import BackgroundDecor from "@/src/layout/customer/BackgroundDecor";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Cosmetics Shop - Trang chủ", 
  description: "Chuyên cung cấp các dòng mỹ phẩm chính hãng, chăm sóc da và làm đẹp với giá tốt nhất. Khám phá bộ sưu tập đa dạng từ các thương hiệu nổi tiếng, đảm bảo chất lượng và an toàn cho làn da của bạn. Mua sắm dễ dàng, giao hàng nhanh chóng và dịch vụ khách hàng tận tâm tại Cosmetics Shop.",
};
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