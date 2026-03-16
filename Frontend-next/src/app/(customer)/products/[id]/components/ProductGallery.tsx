"use client";

import Image from "next/image";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

type Props = {
  productName: string;
  activeImage: string;
  galleryImages: string[];
  setActiveImage: (v: string) => void;
};


export default function ProductGallery({
  productName,
  activeImage,
  galleryImages,
  setActiveImage,
}: Props) {
  const [openPreview ,setOpenPreview] = useState(false);
  return (
    <div className="lg:col-span-5 space-y-4">
      <div className="relative w-full h-[350px] overflow-hidden rounded-lg border bg-white">
        <Image
          src={activeImage || galleryImages[0]} 
          alt={productName}
          fill
          priority
          className="object-over transition-all duration-200"
          onClick ={()=> setOpenPreview(true)}
        />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar mt-2">
        {galleryImages.map((img) => (
          <div
            key={img}
            onClick={() => setActiveImage(img)}
            className={`relative w-20 h-20 flex-shrink-0 cursor-pointer rounded-md border-2 transition-all
            ${activeImage === img ? "border-brand-500 scale-95" : "border-gray-100 hover:border-gray-300"}`}
          >
            <Image
              src={img}
              alt="thumbnail"
              fill
              sizes="80px"
              className="object-cover rounded"
              
            />
          </div>
        ))}
      </div>
       <Lightbox
        open={openPreview}
        close={() => setOpenPreview(false)}
        slides={galleryImages.map((img) => ({ src: img }))}
      />
    </div>
  );
}