import SWTCard from "@/src/@core/component/AntD/SWTCard";
import OrdersClient from "./OrdersClient";

type Props = {
  searchParams: Promise<{
    status?: string;
    page?: string;
  }>;
};

// ĐÂY LÀ SERVER COMPONENT (Không có "use client")
export default async function OrdersPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const activeTab = resolvedSearchParams.status || "ALL";
  const page = Number(resolvedSearchParams.page || 1);

  return (
      <>
           <div className="flex flex-row items-center gap-5 px-4 mb-2">
        <div className="flex flex-col">
            <h1 className="text-3xl font-black text-text-main uppercase tracking-tight m-0">Quản lý đơn hàng</h1>
            <p className="text-[11px] text-text-muted font-black uppercase tracking-widest opacity-60 mt-1">Theo dõi và quản lý các đơn hàng của bạn</p>
        </div>
      </div>
          <OrdersClient 
                initialTab={activeTab}
                initialPage={page}
              />
      </>
  );
}