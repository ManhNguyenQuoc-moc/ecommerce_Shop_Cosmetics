"use client";
import Image from "next/image";
import { Carousel } from "antd";
import SWTCard from "@/src/@core/component/AntD/SWTCard";

type Category = {
  name: string;
  image: string;
};

type Props = {
  categories: Category[];
  loading?: boolean;
};

export default function CategorySection({ categories, loading }: Props) {
  const chunkSize = 6;
  const grouped: Category[][] = [];

  for (let i = 0; i < categories.length; i += chunkSize) {
    let group = categories.slice(i, i + chunkSize);

    if (group.length < chunkSize) {
      const remain = chunkSize - group.length;
      group = [...group, ...categories.slice(0, remain)];
    }

    grouped.push(group);
  }

  return (
    <section>
      <h2 className="text-xl md:text-xl font-bold my-6 text-brand-700">
        Danh mục
      </h2>

      <SWTCard className="my-4" loading={loading} height={240}>
        <Carousel arrows dots={false}>
          {grouped.map((group, index) => (
            <div key={index}>
              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                {group.map((item, idx) => (
                  <div
                    key={idx}
                    className="
                    relative
                    rounded-2xl
                    overflow-hidden
                    cursor-pointer
                    group
                    shadow-sm
                    hover:shadow-xl
                    transition-all
                    duration-300
                    hover:-translate-y-1
                  "
                  >
                    <div className="relative h-[140px]">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="
                        object-cover
                        group-hover:scale-110
                        transition
                        duration-500
                      "
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                <div className="w-[160px] h-[42px] flex items-center justify-center
bg-white/40 backdrop-blur-md border border-white/30
rounded-lg text-xs font-semibold text-center
shadow-lg px-2 leading-tight">
  {item.name}
</div>
                </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Carousel>
      </SWTCard>
    </section>
  );
}