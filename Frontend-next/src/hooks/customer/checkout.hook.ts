"use client";

import { useCheckoutStore } from "@/src/stores/useCheckoutStore";
import { getCustomerInfo } from "@/src/services/customer/user/user.service";
import { authStorage } from "@/src/@core/utils/authStorage";
import { showNotificationSuccess, showNotificationError } from "@/src/@core/utils/message";
import { checkoutService } from "@/src/services/customer/checkout.service";
import { useRouter } from "next/navigation";
import { useCart } from "./cart.hook";
import { CheckoutRequestDTO } from "@/src/services/models/checkout/input.dto";
import { getVoucherByCode } from "@/src/services/customer/voucher.service";

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
    appliedVoucher,
    setCustomer,
    setAddresses,
    setSelectedAddress,
    setShipping,
    setPayment,
    setVoucher,
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
  
  const calculateDiscount = () => {
    if (!appliedVoucher) return 0;
    const subtotal = calculateSubtotal();
    
    // Check min order value again in UI
    if (subtotal < (appliedVoucher.min_order_value || 0)) return 0;

    let discount = 0;
    if (appliedVoucher.type === "PERCENTAGE") {
      discount = (subtotal * appliedVoucher.value) / 100;
      if (appliedVoucher.max_discount_amount && discount > appliedVoucher.max_discount_amount) {
        discount = appliedVoucher.max_discount_amount;
      }
    } else {
      discount = appliedVoucher.value;
    }
    return Math.min(discount, subtotal);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() - calculateDiscount();
  };

  const applyVoucher = async (code: string) => {
    try {
      if (!code) return;
      const voucher = await getVoucherByCode(code);
      if (!voucher) {
        showNotificationError("Mã giảm giá không tồn tại");
        return;
      }

      if (voucher.is_expired) {
        showNotificationError("Mã giảm giá đã hết hạn");
        return;
      }

      if (calculateSubtotal() < (voucher.min_order_value || 0)) {
        showNotificationError(`Đơn hàng tối thiểu ${voucher.min_order_value?.toLocaleString()}đ để dùng mã này`);
        return;
      }

      setVoucher(voucher);
      showNotificationSuccess("Áp dụng mã giảm giá thành công");
    } catch (err) {
      showNotificationError("Không thể kiểm tra mã giảm giá");
    }
  };

  const removeVoucher = () => {
    setVoucher(null);
  };

  const placeOrder = async () => {
    const user = authStorage.getUser();


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
          addressId: (selectedAddress as any).id,
          address: selectedAddress.address,
          lat: selectedAddress.lat,
          lon: selectedAddress.lon,
        },
       
        total: calculateTotal(), // Send final amount calculated by UI (re-verified by server)
        shippingFee: shippingFee,
        shippingMethod: shippingMethod || "standard",
        paymentMethod,
        discountCodeId: appliedVoucher?.id,
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
    calculateDiscount,
    applyVoucher,
    removeVoucher,
    placeOrder,
    reset,
    appliedVoucher,
  };
};
