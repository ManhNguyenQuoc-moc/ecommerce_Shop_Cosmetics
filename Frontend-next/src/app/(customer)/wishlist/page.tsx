import dynamicImport from "next/dynamic";

export const dynamic = "force-dynamic";

const WishlistClient = dynamicImport(() => import("./WishlistClient"));

export default function WishlistPage() {
  return <WishlistClient />;
}