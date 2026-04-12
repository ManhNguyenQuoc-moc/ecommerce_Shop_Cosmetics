import { CheckoutModel ,CheckoutResultModel} from "@/src/services/models/checkout/model";
import { CheckoutRequestDTO } from "@/src/services/models/checkout/input.dto";
import { CheckoutResponseDTO } from "@/src/services/models/checkout/output.dto";

export const mapCheckoutModelToDTO = (
  model: CheckoutModel,
  paymentMethod: "COD" | "VNPAY"
): CheckoutRequestDTO => {
  return {
    items: model.items.map((item) => ({
      productId: item.productId,
      variantId: item.variantId, 
      productName: item.productName,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    })),
    customer: {
      name: model.customer.name,
      phone: model.customer.phone,
      email: model.customer.email,
    },
    address: {
      addressId: model.selectedAddress.id,
      address: model.selectedAddress.address,
      lat: model.selectedAddress.lat,
      lon: model.selectedAddress.lon,
    },
    total: model.total,
    shippingFee: model.shippingFee,
    shippingMethod: model.shippingMethod,
    paymentMethod,
  };
};

export const mapCheckoutResponseToModel = (
  dto: CheckoutResponseDTO
): CheckoutResultModel => {
  return {
    success: dto.success,
    message: dto.message,
    paymentUrl: dto.paymentUrl,
    orderId: dto.data?.id,
    status: dto.data?.status,
  };
};