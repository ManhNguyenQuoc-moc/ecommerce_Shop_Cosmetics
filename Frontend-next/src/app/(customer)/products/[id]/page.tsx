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
  return <ProductDetailUI product={product} />;

}