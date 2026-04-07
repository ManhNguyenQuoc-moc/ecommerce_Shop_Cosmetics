import React from "react";
import ProductListSkeleton from "./components/ProductListSkeleton";

/**
 * Dedicated Loader for the Product List page.
 * Provides a high-fidelity skeleton for the sidebar and grid layout.
 */
export default function Loading() {
  return <ProductListSkeleton />;
}
