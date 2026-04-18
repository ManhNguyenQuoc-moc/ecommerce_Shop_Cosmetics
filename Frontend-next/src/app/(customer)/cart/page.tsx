
import dynamicImport from 'next/dynamic';

export const dynamic = "force-dynamic";

const CartClient = dynamicImport(() => import("./components/CartClient"));

export default function CartPage() {
  return <CartClient />;
}