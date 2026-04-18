import dynamicImport from "next/dynamic";

export const dynamic = "force-dynamic";

const PointsClient = dynamicImport(() => import("./PointsClient"));

export default function PointsPage() {
  return <PointsClient />;
}