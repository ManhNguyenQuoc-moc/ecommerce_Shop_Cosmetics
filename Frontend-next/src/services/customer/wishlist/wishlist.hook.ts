"use client";

import { useWishlistStore } from "@/src/stores/useWishlistStore";
import { ProductListItemDto } from "@/src/services/models/product/output.dto";
import { wishlistService } from "@/src/services/customer/wishlist/wishlist.service";
import { WishlistProductDto } from "@/src/services/models/customer/wishlist.dto";
import { showNotificationSuccess, showNotificationWarning, showNotificationError } from "@/src/@core/utils/message";
import { authStorage } from "@/src/@core/utils/authStorage";
import { useEffect, useMemo } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";

/**
 * Mapping helper for Wishlist DTO from backend to Product List DTO for UI
 */
const mapWishlistToProduct = (item: WishlistProductDto): ProductListItemDto => ({
  id: item.productId,
  variantId: item.variantId,
  name: item.name,
  slug: item.slug,
  image: item.image,
  price: item.price,
  salePrice: item.salePrice,
  brand: item.brandName ? { id: "", name: item.brandName } : null,
  category: null,
  status: item.status,
  availableStock: item.availableStock || 0,
  stock: item.availableStock || 0,
  totalStock: item.availableStock || 0,
  sold: 0,
  createdAt: new Date().toISOString(),
});

export const useWishlist = () => {
  const { items, addItem, removeItem, setItems } = useWishlistStore();
  const { currentUser } = useAuth();

  // 1. Fetch from backend using SWR (Near real-time)
  const token = authStorage.getToken();
  const { data: remoteData, mutate } = useFetchSWR<any[]>(
    (currentUser && token) ? "/wishlist/sync" : null,
    () => wishlistService.getWishlistAsync()
  );

  // 2. Sync remote data to store when data changes
  useEffect(() => {
    if (remoteData && currentUser) {
      const mapped = remoteData.map(mapWishlistToProduct);
      setItems(mapped);
    }
  }, [remoteData, currentUser?.id, setItems]);

  // 3. Toggle action with Optimistic UI
  const toggleItem = async (product: ProductListItemDto) => {
    if (!currentUser) {
      showNotificationWarning("Vui lòng đăng nhập để lưu wishlist ❤️");
      return;
    }

    const key = product.variantId || product.id;
    const isExist = items.some((i) => (i.variantId || i.id) === key);

    try {
      // Step A: Update local store immediately (Optimistic)
      if (isExist) {
        removeItem(product.id);
        showNotificationSuccess("Đã xóa khỏi wishlist 💔");
      } else {
        addItem(product);
        showNotificationSuccess("Đã thêm vào wishlist ❤️");
      }

      // Step B: Send to backend
      if (product.variantId) {
        await wishlistService.toggleWishlistAsync(product.variantId);
        // Step C: Trigger SWR revalidation to keep in sync
        mutate();
      }
    } catch (error: any) {
      console.error("Wishlist toggle error:", error);
      showNotificationError("Không thể cập nhật danh sách yêu thích");
      // Optional: Revert store state on error
      mutate(); 
    }
  };

  const isInWishlist = (id: string, variantId?: string) => {
    const key = variantId || id;
    return items.some((i) => (i.variantId || i.id) === key);
  };

  return {
    items,
    toggleItem,
    isInWishlist,
    isLoading: !remoteData && !!currentUser
  };
};
