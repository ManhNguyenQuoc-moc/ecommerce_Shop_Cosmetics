"use client";

import { useCartStore } from "@/src/stores/useCartStore";
import { cartService } from "@/src/services/customer/cart/cart.service";
import { authStorage } from "@/src/@core/utils/authStorage";
import { showNotificationSuccess, showNotificationError, showNotificationWarning } from "@/src/@core/utils/message";
import { CartItemOutputDto } from "@/src/services/models/cart/output.dto";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import { useEffect } from "react";
import { useAuth } from "@/src/context/AuthContext";

let globalSyncInFlight = false;
let globalLastSyncSignature: string | null = null;

export const useCart = () => {
  const { items, isMerging, hasSynced, setItems, setIsMerging, setHasSynced, reset } = useCartStore();
  const { currentUser: user } = useAuth();
  const token = authStorage.getToken();

  const buildSyncSignature = (
    targetUserId: string,
    targetItems: Array<{ variantId: string; quantity: number }>
  ) => {
    const normalized = [...targetItems]
      .map((i) => ({ variantId: i.variantId, quantity: i.quantity }))
      .sort((a, b) => a.variantId.localeCompare(b.variantId));
    return `${targetUserId}|${JSON.stringify(normalized)}`;
  };

  // 1. Fetch from backend using SWR
  // Only fetch if NOT currently merging guest cart
  const { data: remoteData, mutate } = useFetchSWR(
    (user?.id && token && !isMerging) ? `/carts/${user.id}` : null,
    () => cartService.getCartAsync(user!.id)
  );

  useEffect(() => {
    if (remoteData?.items && user && !isMerging) {
      setItems(remoteData.items);
      setHasSynced(true);
    }
  }, [remoteData, user, setItems, isMerging, setHasSynced]);

  // 3. Auto-sync for Social Login (Redirect return)
  // Detect transition from No User -> User
  useEffect(() => {
    if (user?.id && items.length > 0 && !isMerging && !hasSynced) {
      // If we have items and just logged in, but haven't synced yet
      // We check if the current items are likely guest items (since isMerging is false)
      // and we trigger a sync. This covers the social login redirect case.
      const performAutoSync = async () => {
        if (globalSyncInFlight) return;
        setIsMerging(true);
        globalSyncInFlight = true;
        try {
            await syncCart(user.id, items);
            setHasSynced(true); // Mark as synced for this session
        } finally {
          globalSyncInFlight = false;
            setIsMerging(false);
        }
      };
      performAutoSync();
    }
    // We only want to trigger this when user.id BECOMES available
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

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
      const previousItems = [...items];
      // Optimistic Update: Add locally first
      if (exist) {
        setItems(items.map((i) =>
          i.variantId === item.variantId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        ));
      } else {
        setItems([...items, { ...item, id: item.id || `temp-${Date.now()}` }]);
      }

      try {
        const data = await cartService.addItemAsync(user.id, item.variantId, item.quantity);
        setItems(data.items);
        mutate(data, false);
        showNotificationSuccess(`Đã thêm ${item.productName} vào giỏ hàng`);
      } catch (err: unknown) {
        // Rollback on error
        setItems(previousItems);
        showNotificationError(err instanceof Error ? err.message : "Không thể thêm vào giỏ hàng");
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
      const previousItems = [...items];
      // Optimistic Update: Update quantity locally
      setItems(items.map((i) => (i.id === id ? { ...i, quantity } : i)));

      try {
        const data = await cartService.updateQuantityAsync(user.id, id, quantity);
        setItems(data.items);
        mutate(data, false);
      } catch (err: unknown) {
        // Rollback on error
        setItems(previousItems);
        showNotificationError(err instanceof Error ? err.message : "Cập nhật số lượng thất bại");
      }
      return;
    }

    setItems(items.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const removeItem = async (id: string) => {
    if (user?.id) {
      const previousItems = [...items];
      // Optimistic Update: Remove locally first
      setItems(items.filter((i) => i.id !== id));

      try {
        const data = await cartService.removeItemAsync(user.id, id);
        setItems(data.items);
        mutate(data, false);
        showNotificationSuccess("Đã xóa sản phẩm khỏi giỏ hàng");
      } catch {
        // Rollback on error
        setItems(previousItems);
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
      } catch {}
    }
    setItems([]);
  };

  const syncCart = async (
    forcedUserId?: string,
    itemsToSync?: Array<{ variantId: string; quantity: number }>
  ) => {
    const targetUserId = forcedUserId || user?.id;
    const targetItems = itemsToSync || items;
    
    if (targetUserId && targetItems.length > 0) {
      const signature = buildSyncSignature(targetUserId, targetItems);
      if (globalLastSyncSignature === signature) {
        return;
      }

      try {
        globalLastSyncSignature = signature;
        const syncData = targetItems.map(i => ({ variantId: i.variantId, quantity: i.quantity }));
        const data = await cartService.syncCartAsync(targetUserId, syncData);
        mutate(data, false);
        
        setItems(data.items);
        setHasSynced(true);
      } catch {
        globalLastSyncSignature = null;
      }
    }
  };

  const total = items.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return {
    items,
    isLoading: !remoteData && !!user,
    isMerging,
    total,
    count,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    syncCart,
    setIsMerging,
    reset,
  };
};
