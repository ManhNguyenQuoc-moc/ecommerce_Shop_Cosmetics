
import { Package } from "lucide-react";
import AdminPageHeader from "../components/AdminPageHeader";
import ProductsClient from "./ProductsClient";

export const dynamic = "force-dynamic";

export default function ProductsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <AdminPageHeader
        title="Quản lý Sản phẩm"
        subtitle="Xem, thêm mới và quản lý thông tin các sản phẩm trong kho."
        icon={<Package size={32} />}
        breadcrumbs={[
          { title: "Trang chủ", href: "/admin" },
          { title: "Products" }
        ]}
        tooltip={{
          title: "Quản lý danh lục sản phẩm, giá bán và phân loại danh mục.",
          placement: "left"
        }}
      />
      <ProductsClient />
    </div>
  );
}
