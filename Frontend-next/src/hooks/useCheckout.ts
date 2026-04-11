"use client";

import { useCheckoutStore } from "@/src/stores/useCheckoutStore";
import { getCustomerInfo } from "@/src/services/customer/user.service";
import { authStorage } from "@/src/@core/utils/authStorage";
import { showNotificationSuccess, showNotificationError } from "@/src/@core/utils/message";
import { checkoutService } from "@/src/services/customer/checkout.service";
import { useRouter } from "next/navigation";
import { useCart } from "./useCart";
import { CheckoutRequestDTO } from "@/src/services/models/checkout/input.dto";

export const useCheckout = () => {
  const router = useRouter();
  const { clearCart } = useCart();
  const {
    mode,
    items,
    customer,
    addresses,
    selectedAddress,
    shippingMethod,
    paymentMethod,
    setCustomer,
    setAddresses,
    setSelectedAddress,
    setShipping,
    setPayment,
    reset,
  } = useCheckoutStore();

  const fetchCustomerInfo = async () => {
    const user = authStorage.getUser();
    if (!user?.id) return;

    try {
      const data = await getCustomerInfo(user.id);
      setCustomer({
        name: (data as any).full_name || data.name || "",
        phone: data.phone || "",
        email: data.email || "",
      });
      setAddresses(data.addresses || []);
      if (data.addresses?.length > 0 && !selectedAddress) {
        setSelectedAddress(data.addresses[0]);
      }
    } catch (err) {
      console.error("Fetch customer info error:", err);
    }
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  };

  const calculateShipping = () => {
    return shippingMethod === "express" ? 30000 : 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const placeOrder = async () => {
    const user = authStorage.getUser();
    if (!user?.id) {
      showNotificationError("Vui lòng đăng nhập để đặt hàng");
      return;
    }

    if (!customer.name || !customer.phone || !selectedAddress) {
      showNotificationError("Vui lòng nhập đầy đủ thông tin giao hàng");
      return;
    }

    try {
      const subtotal = calculateSubtotal();
      const shippingFee = calculateShipping();

      const payload: CheckoutRequestDTO = {
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          productName: i.productName,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })),
        customer: {
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
        },
        address: {
          address: selectedAddress.address,
          lat: selectedAddress.lat,
          lon: selectedAddress.lon,
        },
        addressId: (selectedAddress as any).id,
        total: subtotal,
        shippingFee: shippingFee,
        shippingMethod: shippingMethod || "standard",
        paymentMethod,
      };

      const res = await checkoutService.createOrder(payload);
      
      if (res?.paymentUrl) {
        window.location.href = res.paymentUrl;
        return;
      }

      showNotificationSuccess("Đặt hàng thành công 🎉");
      
      if (mode === "cart") {
        await clearCart();
      }
      
      reset();
      router.push("/profile/orders");
    } catch (err: any) {
      console.error("Checkout error:", err);
      showNotificationError(err.message || "Đặt hàng thất bại");
    }
  };

  return {
    mode,
    items,
    customer,
    addresses,
    selectedAddress,
    shippingMethod,
    paymentMethod,
    setCustomer,
    setAddresses,
    setSelectedAddress,
    setShipping,
    setPayment,
    fetchCustomerInfo,
    calculateSubtotal,
    calculateShipping,
    calculateTotal,
    placeOrder,
    reset,
  };
};
