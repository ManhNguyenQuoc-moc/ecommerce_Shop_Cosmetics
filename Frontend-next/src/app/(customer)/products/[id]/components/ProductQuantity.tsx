import SWTInputNumber from "@/src/@core/component/AntD/SWTInputNumber";

type Props = {
  qty: number;
  setQty: (v: number) => void;
  max?: number;
};

export default function ProductQuantity({ qty, setQty, max = 5 }: Props) {
  return (
    <div className="flex items-center gap-4 pt-2">
      <span className="text-sm text-gray-700">
        Số lượng
      </span>
      <SWTInputNumber
        value={qty}
        mode="spinner"
        min={1}
        max={max}
        onChange={(v) => setQty(Number(v) || 1)}
        className="!w-[120px]"
        size="middle"
      />
      {max < 5 && max > 0 && (
        <span className="text-xs text-orange-500 font-medium italic">
          (Còn {max} sản phẩm)
        </span>
      )}
    </div>
  );
}
