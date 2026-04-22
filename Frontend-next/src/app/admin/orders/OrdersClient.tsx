"use client";

import { useState } from 'react';
import useSWTTilte from "@/src/@core/hooks/useSWTTitle";
import OrderFilters from "./components/OrderFilters";
import OrderTable from "./components/OrderTable";
import SWTTabs from "@/src/@core/component/AntD/SWTTabs";
import { useOrders } from "@/src/services/admin/order/order.hook";
import { OrderQueryParams } from "@/src/services/admin/order/order.service";
import OrderDetailDrawer from "./components/OrderDetailDrawer";
import { OrderDto, OrderListResponseDto } from "@/src/services/models/order/output.dto";
import { OrderStatus } from "@/src/enums";
import { get } from "@/src/@core/utils/api";
import { buildQueryString } from "@/src/@core/utils/query.util";
import { showNotificationError } from "@/src/@core/utils/message";
import { exportOrdersToExcel, exportOrdersToPDF } from "@/src/@core/utils/excelandpdf/exportOrder";
import { ORDER_API_ENDPOINT } from "@/src/services/admin/order/order.service";

export default function OrdersClient() {
  useSWTTilte("Quản lý đơn hàng");
  const [params, setParams] = useState<OrderQueryParams>({
    page: 1,
    pageSize: 6,
    sortBy: "newest",
  });

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const { orders, total, isLoading, mutate } = useOrders(params);

  const fetchAllOrders = async () => {
    const filters = {
      ...params,
      page: 1,
      pageSize: 9999,
    };

    const query = buildQueryString(filters);
    const response = await get<OrderListResponseDto>(`${ORDER_API_ENDPOINT}${query}`);
    return response.data;
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const data = await fetchAllOrders();
      await exportOrdersToExcel(data);
    } catch (error) {
      console.error("Export error:", error);
      showNotificationError("Có lỗi xảy ra khi xuất file Excel");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const data = await fetchAllOrders();
      await exportOrdersToPDF(data);
    } catch (error) {
      console.error("Export error:", error);
      showNotificationError("Có lỗi xảy ra khi xuất file PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const handleParamChange = (newParams: Partial<OrderQueryParams>) => {
    setParams(prev => {
      const nextParams = { ...prev, ...newParams };

      if (newParams.page !== undefined || newParams.pageSize !== undefined) {
        return nextParams;
      }

      return { ...nextParams, page: 1 };
    });
  };

  const handleClear = () => {
    setParams({
      page: 1,
      pageSize: 6,
      sortBy: "newest",
    });
  };

  const handleView = (order: OrderDto) => {
    setSelectedOrderId(order.id);
    setIsDrawerOpen(true);
  };

  return (
    <div>
      <div>
        <SWTTabs
          activeKey={params.status || "ALL"}
          onChange={(key) => handleParamChange({ status: key === "ALL" ? undefined : (key as OrderStatus) })}
          items={[
            { key: "ALL", label: "Tất cả" },
            { key: "PENDING", label: "Chờ xác nhận" },
            { key: "CONFIRMED", label: "Đã xác nhận" },
            { key: "SHIPPING", label: "Đang giao" },
            { key: "DELIVERED", label: "Đã giao" },
            { key: "CANCELLED", label: "Đã hủy" },
            { key: "RETURNED", label: "Trả hàng" }
          ]}
        />
      </div>

      <div className=" admin-card p-6">
        <OrderFilters
          params={params}
          onParamChange={handleParamChange}
          onClear={handleClear}
          onExportExcel={handleExportExcel}
          onExportPDF={handleExportPDF}
          isExporting={isExporting}
        />
        <OrderTable
          orders={orders}
          total={total}
          isLoading={isLoading}
          page={params.page || 1}
          pageSize={params.pageSize || 6}
          onPaginationChange={(page, pageSize) => {
            // If pageSize changed, reset to page 1
            if (pageSize !== (params.pageSize || 6)) {
              handleParamChange({ page: 1, pageSize });
            } else {
              handleParamChange({ page, pageSize });
            }
          }}
          onView={handleView}
        />
      </div>

      <OrderDetailDrawer
        orderId={selectedOrderId}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onUpdate={mutate}
      />
    </div>
  );
}
