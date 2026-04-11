import { Order, OrderItem, OrderStatusHistory, Product, ProductVariant, User, Address, Image } from "@prisma/client";

type OrderWithRelations = Order & {
  user: User;
  address: Address | null;
  items: (OrderItem & {
    variant: (ProductVariant & {
      product: Product;
      image: Image | null;
    }) | null;
  })[];
  status_history: OrderStatusHistory[];
};

export class OrderMapper {
  static toDto(order: OrderWithRelations | any) {
    if (!order) return null;

    const user = order.user;
    const generatedCode = order.id.split('-')[0].toUpperCase();

    return {
      id: order.id,
      code: generatedCode,
      userId: order.userId,
      customer_name: user?.full_name || "Khách vãng lai",
      customer_email: user?.email || "",
      customer_phone: user?.phone || "",
      shipping_address: order.address?.address || "N/A",
      total_amount: order.total_amount,
      shipping_fee: order.shipping_fee,
      shipping_method: order.shipping_method,
      final_amount: order.final_amount,
      current_status: order.current_status,
      payment_method: order.payment_method,
      payment_status: order.payment_status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.items?.map((item: any) => ({
        id: item.id,
        orderId: item.orderId,
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price_at_purchase,
        variant: item.variant ? {
          id: item.variant.id,
          sku: item.variant.sku,
          color: item.variant.color,
          size: item.variant.size,
          image: item.variant.image?.url || null,
          product: item.variant.product ? {
            id: item.variant.product.id,
            name: item.variant.product.name,
            slug: item.variant.product.slug,
          } : null,
          price: item.variant.price
        } : null
      })) || [],
      status_history: order.status_history?.map((h: any) => ({
        id: h.id,
        orderId: h.orderId,
        status: h.status,
        note: h.note || "",
        createdAt: h.timestamp || h.createdAt,
      })) || []
    };
  }
}
