import { VoucherDTO } from "../models/customer/voucher.dto";

const MOCK_VOUCHERS: VoucherDTO[] = [
  {
    id: "v1",
    code: "GIFT50K",
    name: "Giảm 50k cho đơn từ 500k",
    description: "Áp dụng cho tất cả sản phẩm tại cửa hàng",
    type: "FIXED_AMOUNT",
    value: 50000,
    min_order_value: 500000,
    start_date: "2024-01-01T00:00:00Z",
    end_date: "2024-12-31T23:59:59Z",
    is_used: false,
    is_expired: false,
  },
  {
    id: "v2",
    code: "FREESHIP",
    name: "Miễn phí vận chuyển",
    description: "Tối đa 30k cho đơn hàng từ 200k",
    type: "FREE_SHIPPING",
    value: 30000,
    min_order_value: 200000,
    start_date: "2024-01-01T00:00:00Z",
    end_date: "2024-12-31T23:59:59Z",
    is_used: false,
    is_expired: false,
  },
  {
    id: "v3",
    code: "BEAUTY20",
    name: "Giảm 20% cho đơn hàng mỹ phẩm",
    description: "Giảm tối đa 100k cho các sản phẩm trang điểm",
    type: "PERCENTAGE",
    value: 20,
    min_order_value: 300000,
    max_discount_amount: 100000,
    start_date: "2024-03-01T00:00:00Z",
    end_date: "2024-03-31T23:59:59Z",
    is_used: true,
    is_expired: false,
  }
];

export const getVouchers = async (): Promise<VoucherDTO[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_VOUCHERS;
};
