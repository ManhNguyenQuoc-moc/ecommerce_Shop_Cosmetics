import React from "react";
import HomeSkeleton from "./home/components/HomeSkeleton";

/**
 * Main Loader for (customer) group.
 * Uses HomeSkeleton by default to provide a high-fidelity shimmer effect instantly.
 * This is great for SEO as it provides a meaningful page structure immediately.
 */
export default function Loading() {
  return <HomeSkeleton />;
}