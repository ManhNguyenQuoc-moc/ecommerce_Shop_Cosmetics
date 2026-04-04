import { Suspense } from "react";
import { getProductDetail } from "@/src/services/customer/product.service";
import ProductDetailUI from "./ProductDetailUI";
type Props = {
  params: {
    id: string;
  };
};

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductDetail(id);
  console.log(product);
  return (
    <Suspense fallback={<div className="animate-pulse flex items-center justify-center p-20 text-brand-500 font-bold text-lg">Đang tải thông tin sản phẩm...</div>}>
      <ProductDetailUI product={product} />
    </Suspense>
  );

}