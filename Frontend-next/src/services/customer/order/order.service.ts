import { get, put } from "../../../@core/utils/api";
import { OrderDTO, OrderListResponseDTO, OrderStatus } from "../../models/customer/order.dto";

export const getOrders = async (status?: OrderStatus, page: number = 1, pageSize: number = 6): Promise<OrderListResponseDTO> => {
  const query = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });
  if (status) query.append("status", status);
  const response = await get<OrderListResponseDTO>(`/orders/me?${query.toString()}`);
  const orders = (response.data || []).map((order: OrderDTO) => transformOrder(order));

  return {
    data: orders,
    total: response.total || 0,
  };
};

export const getOrderDetails = async (id: string): Promise<OrderDTO> => {
  const order = await get<OrderDTO>(`/orders/${id}`);
  return transformOrder(order);
};

export const cancelOrder = async (id: string): Promise<OrderDTO> => {
  return await put<OrderDTO>(`/orders/${id}`, { current_status: "CANCELLED" });
};

const transformOrder = (order: any): OrderDTO => {
  return {
    ...order,
    items: (order.items || []).map((item: any) => ({
      id: item.id,
      variantId: item.variantId,
      product_name: item.variant?.product?.name || "Sản phẩm",
      product_image: item.variant?.image?.url || item.variant?.image || item.variant?.product?.image || item.variant?.product?.thumbnail || "",
      variant_name: [item.variant?.color, item.variant?.size].filter(Boolean).join(" - "),
      price: item.price || item.price_at_purchase,
      quantity: item.quantity,
    })),
    shipping_address: order.address?.address || order.shipping_address || "N/A",
  };
};
