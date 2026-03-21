import { OrderDTO, OrderListResponseDTO, OrderStatus } from "../models/customer/order.dto";

const MOCK_ORDERS: OrderDTO[] = [
  {
    id: "1",
    order_code: "ORD-20240321-001",
    status: "COMPLETED",
    created_at: "2024-03-21T08:00:00Z",
    total_amount: 1250000,
    payment_method: "Thanh toán khi nhận hàng (COD)",
    shipping_address: "123 Đường ABC, Quận 1, TP. Hồ Chí Minh",
    items: [
      {
        id: "p1",
        product_name: "Son Kem Lì Black Rouge Air Fit Velvet Tint",
        product_image: "https://placehold.co/100x100?text=Black+Rouge",
        variant_name: "A12 - Dashed Brown",
        price: 150000,
        quantity: 2,
      },
      {
        id: "p2",
        product_name: "Nước Tẩy Trang L'Oreal Micellar Water Refreshing",
        product_image: "https://placehold.co/100x100?text=LOreal",
        variant_name: "400ml",
        price: 190000,
        quantity: 1,
      }
    ],
  },
  {
    id: "2",
    order_code: "ORD-20240320-099",
    status: "SHIPPING",
    created_at: "2024-03-20T14:30:00Z",
    total_amount: 850000,
    payment_method: "Chuyển khoản ngân hàng",
    shipping_address: "456 Đường XYZ, Hà Đông, Hà Nội",
    items: [
      {
        id: "p3",
        product_name: "Kem Chống Nắng La Roche-Posay Anthelios",
        product_image: "https://placehold.co/100x100?text=LRP",
        variant_name: "50ml",
        price: 450000,
        quantity: 1,
      }
    ],
  },
  {
    id: "3",
    order_code: "ORD-20240315-050",
    status: "CANCELLED",
    created_at: "2024-03-15T10:00:00Z",
    total_amount: 300000,
    payment_method: "Ví MoMo",
    shipping_address: "789 Đường LMN, Hải Châu, Đà Nẵng",
    items: [
      {
        id: "p4",
        product_name: "Mặt Nạ Giấy Banobagi Vita Genic Jelly Mask",
        product_image: "https://placehold.co/100x100?text=Banobagi",
        variant_name: "Hộp 10 miếng",
        price: 250000,
        quantity: 1,
      }
    ],
  }
];

export const getOrders = async (status?: OrderStatus): Promise<OrderListResponseDTO> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const filtered = status 
    ? MOCK_ORDERS.filter(o => o.status === status)
    : MOCK_ORDERS;

  return {
    data: filtered,
    total: filtered.length,
  };
};

export const getOrderDetails = async (id: string): Promise<OrderDTO | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return MOCK_ORDERS.find(o => o.id === id);
};
