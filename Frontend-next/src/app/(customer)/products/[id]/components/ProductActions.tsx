import SWTButton from "@/src/@core/component/AntD/SWTButton";

type Props = {
  qty: number;
};

export default function ProductActions({ qty }: Props) {
  return (
    <div className="flex gap-3 pt-4">

      <SWTButton
        className="flex-1 !border-brand-500 !text-brand-500 !py-5 font-medium hover:!bg-brand-50 transition"
      >
        Thêm vào giỏ hàng
      </SWTButton>

      <SWTButton
        className="flex-1 !bg-brand-500 !text-white !py-5 font-medium hover:!bg-brand-700 transition"
      >
        Mua ngay ({qty})
      </SWTButton>

    </div>
  );
}