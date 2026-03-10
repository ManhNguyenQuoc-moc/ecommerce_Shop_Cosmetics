import SWTCard from "@/src/@core/component/AntD/SWTCard";

type Product = {
  name: string;
  price: number;
  image: string;
};

type Props = {
  title: string;
  products: Product[];
};

export default function ProductSection({ title, products }: Props) {
  return (
    <section>
      <h2 className="text-xl font-semibold my-4">{title}</h2>
      <div className="grid grid-cols-5 gap-4">
        {products.map((product, index) => (
          <SWTCard key={index}>
            <div className="p-4 hover:scale-[1.02] transition cursor-pointer">
              <img src={product.image} className="h-32 mx-auto mb-3 object-contain" />
              <p className="text-sm font-medium line-clamp-2">
                {product.name}
              </p>
              <p className="text-blue-600 font-bold mt-2">
                {product.price.toLocaleString()}đ
              </p>
            </div>
          </SWTCard>
        ))}
      </div>
    </section>
  );
}