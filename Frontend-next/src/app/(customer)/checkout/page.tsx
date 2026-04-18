
import dynamicImport from 'next/dynamic';

export const dynamic = "force-dynamic";

const CheckoutClient = dynamicImport(() => import("./components/CheckoutClient"));

export default function CheckoutPage() {
  return <CheckoutClient />;
}