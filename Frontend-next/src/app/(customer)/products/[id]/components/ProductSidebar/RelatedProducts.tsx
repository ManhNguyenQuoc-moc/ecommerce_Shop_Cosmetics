import ProductSmallCard from "./ProductSmallCard";

export default function RelatedProducts() {

  const products = [1,2,3,4];

  return (
    <div className="rounded-xl space-y-4 bg-white mt-2.5 p-2">

      <h3 className="font-semibold">
        Sản phẩm xem cùng
      </h3>
      <div className="space-y-4">
        {products.map((p) => (
          <ProductSmallCard key={p} />
        ))}
      </div>

    </div>
  );
}