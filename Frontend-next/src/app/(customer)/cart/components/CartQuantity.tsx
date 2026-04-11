"use client";

import SWTInputNumber from "@/src/@core/component/AntD/SWTInputNumber";

type Props = {
 quantity: number;
 max?: number;
 onChange?: (value: number | string | null) => void;
};

export default function CartQuantity({ quantity, max, onChange }: Props) {
  return (
    <SWTInputNumber
      variant ="filled"
      mode ="spinner"
      min={1}
      max={max}
      size="small"
      value={quantity} 
      onChange={(value) => {
        if (value !== null) {
          onChange?.(value);
        }
      }}
      classNames="w-12"
    />
  );
}