"use client";

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
  const chunkSize = 4;
  const grouped = [];

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
      <h2 className="text-2xl font-semibold my-4">Danh mục</h2>

      <SWTCard loading={loading} height={220}>
        <Carousel arrows autoplay dots={false}>
          {grouped.map((group, index) => (
            <div key={index}>
              <div className="grid grid-cols-4 gap-4 p-4">
                {group.map((item, idx) => (
                  <div key={idx}>
                    <div
                      className="
                      bg-white rounded-xl flex flex-col h-[180px] cursor-pointer
                      shadow-md shadow-gray-200
                      hover:shadow-xl hover:shadow-gray-300
                      hover:-translate-y-1
                      transition-all duration-300
                    "
                    >
                      <div className="flex-1 overflow-hidden rounded-t-xl">
                        <img
                          src={item.image}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="py-2 text-center text-sm font-medium">
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