import { useCartStore } from "@/src/stores/useCartStore";
import { cartService } from "@/src/services/customer/cart.service";
import { authStorage } from "@/src/@core/utils/authStorage";
import { showNotificationSuccess, showNotificationError, showNotificationWarning } from "@/src/@core/utils/message";
import { CartItemOutputDto } from "@/src/services/models/cart/output.dto";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import { useEffect } from "react";
import { useAuth } from "@/src/context/AuthContext";

export const useCart = () => {
  const { items, isLoading, setItems, setLoading, reset } = useCartStore();
  const { currentUser: user } = useAuth();
  const token = authStorage.getToken();

  // 1. Fetch from backend using SWR
  const { data: remoteData, mutate } = useFetchSWR(
    (user?.id && token) ? `/carts/${user.id}` : null,
    () => cartService.getCartAsync(user!.id)
  );

  // 2. Sync remote data to store
  useEffect(() => {
    if (remoteData?.items && user) {
      setItems(remoteData.items);
    }
  }, [remoteData, user?.id, setItems]);

  const MAX_ITEMS_PER_VARIANT = 5;

  const addItem = async (item: CartItemOutputDto) => {
    // A. Validation: Check available stock and MAX_ITEMS
    const exist = items.find((i) => i.variantId === item.variantId);
    const currentQty = exist ? exist.quantity : 0;
    const requestedQty = item.quantity;
    const totalQty = currentQty + requestedQty;

    if (totalQty > MAX_ITEMS_PER_VARIANT) {
        showNotificationWarning(`Bạn chỉ có thể thêm tối đa ${MAX_ITEMS_PER_VARIANT} sản phẩm cho mỗi loại.`);
        return;
    }

    if (item.availableStock !== undefined && totalQty > item.availableStock) {
      showNotificationWarning(`Sản phẩm chỉ còn ${item.availableStock} sản phẩm khả dụng.`);
      return;
    }

    // B. Logic for Logged-in 
    if (user?.id) {
      try {
        const data = await cartService.addItemAsync(user.id, item.variantId, item.quantity);
        setItems(data.items);
        mutate();
        showNotificationSuccess(`Đã thêm ${item.productName} vào giỏ hàng`);
      } catch (err: any) {
        showNotificationError(err.message || "Không thể thêm vào giỏ hàng");
      }
      return;
    }

    // C. Logic for Guest
    if (exist) {
      setItems(items.map((i) =>
        i.variantId === item.variantId
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
      ));
    } else {
      setItems([...items, item]);
    }
    showNotificationSuccess(`Đã thêm ${item.productName} vào giỏ hàng`);
  };

  const updateQuantity = async (id: string, variantId: string, quantity: number) => {
    // A. Validation: Check available stock and MAX_ITEMS
    if (quantity > MAX_ITEMS_PER_VARIANT) {
        showNotificationWarning(`Số lượng tối đa cho mỗi sản phẩm là ${MAX_ITEMS_PER_VARIANT}.`);
        return;
    }

    const item = items.find(i => i.id === id);
    if (item && item.availableStock !== undefined && quantity > item.availableStock) {
       showNotificationWarning(`Sản phẩm chỉ còn tối đa ${item.availableStock} sản phẩm.`);
       return;
    }

    if (user?.id) {
      try {
        const data = await cartService.updateQuantityAsync(user.id, id, quantity);
        setItems(data.items);
        mutate();
      } catch (err: any) {
        showNotificationError(err.message || "Cập nhật số lượng thất bại");
      }
      return;
    }

    setItems(items.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const removeItem = async (id: string) => {
    if (user?.id) {
      try {
        const data = await cartService.removeItemAsync(user.id, id);
        setItems(data.items);
        mutate();
        showNotificationSuccess("Đã xóa sản phẩm khỏi giỏ hàng");
      } catch (err) {
        showNotificationError("Xóa sản phẩm thất bại");
      }
      return;
    }

    setItems(items.filter((i) => i.id !== id));
  };

  const clearCart = async () => {
    if (user?.id) {
      try {
        await cartService.clearCartAsync(user.id);
        mutate();
      } catch (err) {}
    }
    setItems([]);
  };

  const syncCart = async (forcedUserId?: string, itemsToSync?: any[]) => {
    const targetUserId = forcedUserId || user?.id;
    const targetItems = itemsToSync || items;
    
    if (targetUserId && targetItems.length > 0) {
      try {
        const syncData = targetItems.map(i => ({ variantId: i.variantId, quantity: i.quantity }));
        const data = await cartService.syncCartAsync(targetUserId, syncData);
        
        // Optimistically update SWR cache to prevent race condition with auto-fetch
        mutate(data, false);
        
        setItems(data.items);
      } catch (err) {}
    }
  };

  const total = items.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return {
    items,
    isLoading: !remoteData && !!user,
    total,
    count,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    syncCart,
    reset,
  };
};
