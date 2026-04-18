import dynamicImport from "next/dynamic";

export const dynamic = "force-dynamic";

const RewardsPageClient = dynamicImport(() => import("./RewardsPageClient"));

export default function AdminRewardsPage() {
  return <RewardsPageClient />;
}
