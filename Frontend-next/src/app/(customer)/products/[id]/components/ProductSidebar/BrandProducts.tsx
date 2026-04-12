import ProductSmallCard from "./ProductSmallCard";

type Props = {
  brand: { id: string; name: string };
};

export default function BrandProducts({ brand }: Props) {
  const products = [1, 2, 3, 4];
  return (
    <div className="rounded-xl space-y-4 bg-white mt-2.5 p-2">
      <h3 className="font-semibold">
        Sản phẩm cùng thương hiệu
      </h3>
      <div className="space-y-4  ">
        {products.map((p) => (
          <ProductSmallCard key={p} />
        ))}
      </div>
    </div>
  );
}