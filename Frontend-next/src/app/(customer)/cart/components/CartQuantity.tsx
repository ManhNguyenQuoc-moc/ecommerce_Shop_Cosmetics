"use client";

type Props = {
  quantity: number;
};

export default function CartQuantity({ quantity }: Props) {
  return (
    <input
      type="number"
      defaultValue={quantity}
      min={1}
      className="w-16 border rounded px-2 py-1 text-center"
    />
  );
}