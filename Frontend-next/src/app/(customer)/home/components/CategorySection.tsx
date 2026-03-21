"use client";
import Image from "next/image";
import { Carousel } from "antd";
import SWTCard from "@/src/@core/component/AntD/SWTCard";
import { LayoutGrid } from "lucide-react";

type Category = {
  name: string;
  image: string;
  slug?: string;
  id?: string;
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
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-brand-200">
          <LayoutGrid size={20} fill="currentColor" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase italic">Danh mục</h2>
      </div>


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
bg-white/40 backdrop-blur-md border border-white/20
rounded-lg text-xs font-bold text-center
shadow-lg px-2 leading-tight text-gray-900 group-hover:bg-white/80 transition-all">
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