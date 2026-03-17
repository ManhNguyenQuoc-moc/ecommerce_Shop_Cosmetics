import SWTInputNumber from "@/src/@core/component/AntD/SWTInputNumber";

type Props = {
  qty: number;
  setQty: (v: number) => void;
};

export default function ProductQuantity({ qty, setQty }: Props) {
  return (
    <div className="flex items-center gap-4 pt-2">
      <span className="text-sm text-gray-700">
        Số lượng
      </span>
      <SWTInputNumber
        value={qty}
        mode ="spinner"
        min={1}
        max={100}
        onChange={(v) => setQty(v)}
        className="!w-[120px]"
        size="middle"
      />
    </div>
  );
}