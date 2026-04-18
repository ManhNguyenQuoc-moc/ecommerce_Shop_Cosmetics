"use client";

import { useCheckoutStore } from "@/src/stores/useCheckoutStore";
import { getCustomerInfo } from "@/src/services/customer/user/user.service";
import { authStorage } from "@/src/@core/utils/authStorage";
import { showNotificationSuccess, showNotificationError } from "@/src/@core/utils/message";
import { checkoutService } from "@/src/services/customer/checkout/checkout.service";
import { useRouter } from "next/navigation";
import { useCart } from "../cart/cart.hook";
import { CheckoutRequestDTO } from "@/src/services/models/checkout/input.dto";
import { getVoucherByCode } from "@/src/services/customer/voucher/voucher.service";
import { useSWRConfig } from "swr";

export const useCheckout = () => {
  const router = useRouter();
  const { clearCart } = useCart();
  const { mutate } = useSWRConfig();  // ← Get global SWR mutate function
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
        name: ((data as any).full_name || (data as any).name || "") as string,
        phone: (data as any).phone || "",
        email: (data as any).email || "",
      });
      setAddresses((data as any).addresses || []);
      if ((data as any).addresses?.length > 0 && !selectedAddress) {
        setSelectedAddress((data as any).addresses[0]);
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
      discount = (subtotal * appliedVoucher.discount) / 100;
      if (appliedVoucher.max_discount && discount > appliedVoucher.max_discount) {
        discount = appliedVoucher.max_discount;
      }
    } else {
      discount = appliedVoucher.discount;
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

      // Check if user already used this voucher
      if (voucher.is_used_by_user) {
        showNotificationError("Bạn đã sử dụng mã giảm giá này rồi");
        return;
      }

      const now = new Date();
      const endDate = new Date(voucher.valid_until);
      const isExpired = now > endDate || !voucher.isActive;
      if (isExpired) {
        showNotificationError("Mã giảm giá đã hết hạn");
        return;
      }

      if (voucher.used_count >= voucher.usage_limit) {
        showNotificationError("Mã giảm giá đã hết lượt dùng");
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
      
      // Refetch all voucher caches after successful checkout
      // This ensures vouchers marked as used are updated immediately
      const user = authStorage.getUser();
      if (user?.id) {
        // Clear both regular and redeem voucher caches
        await mutate(key => typeof key === 'string' && (
          key.includes('vouchers_') || key.includes('redeem_vouchers_')
        ));
      }
      
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
