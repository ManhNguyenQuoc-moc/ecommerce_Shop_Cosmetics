import SWTCard from "@/src/@core/component/AntD/SWTCard";

type Brand = {
  name: string;
  logo: string;
};

type Props = {
  brands: Brand[];
};

export default function BrandSection({ brands }: Props) {
  return (
    <section>
      <h2 className="text-xl font-semibold my-4">Thương hiệu</h2>
      <div className="grid grid-cols-6 gap-4">
        {brands.map((brand, index) => (
          <div key={index}>
            <div className="flex items-center justify-center p-4 hover:scale-105 transition cursor-pointer">
              <img src={brand.logo} className="h-10 object-contain" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}