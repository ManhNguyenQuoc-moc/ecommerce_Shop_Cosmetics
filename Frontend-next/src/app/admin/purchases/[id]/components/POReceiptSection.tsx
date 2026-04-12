"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FileSpreadsheet, FileText, PackageCheck, Save, X, Layers } from "lucide-react";
import dayjs from "dayjs";
import { PODetailDto } from "@/src/services/models/purchase/output.dto";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import SWTTable from "@/src/@core/component/AntD/SWTTable";
import SWTForm from "@/src/@core/component/AntD/SWTForm";
import SWTFormItem from "@/src/@core/component/AntD/SWTFormItem";
import SWTInput from "@/src/@core/component/AntD/SWTInput";
import SWTInputNumber from "@/src/@core/component/AntD/SWTInputNumber";
import SWTDatePicker from "@/src/@core/component/AntD/SWTDatePicker";
import SWTCheckbox from "@/src/@core/component/AntD/SWTCheckbox";
import { showNotificationSuccess, showNotificationError, showNotificationWarning } from "@/src/@core/utils/message";
import { receiveStock, usePurchaseOrderReceipts } from "@/src/services/admin/purchase.service";

const COLUMN_WIDTH = {
  product : 200,
  checkbox: 50,
  variant: 130,
  sku: 120,
  progress: 90,
  qty: 100,
  batch: 165,
  date: 150,
};

interface POReceiptSectionProps {
  po: PODetailDto;
  showReceiveForm: boolean;
  setShowReceiveForm: (val: boolean) => void;
  onReceiveSuccess: () => void;
  onExport: (type: "pdf" | "excel", includeReceipt: boolean) => void;
}

interface ItemFormValues {
  [key: `qty_${string}`]: number;
  [key: `batch_${string}`]: string;
  [key: `expiry_${string}`]: dayjs.Dayjs | null;
  [key: `mfg_${string}`]: dayjs.Dayjs | null;
}

const POReceiptSection: React.FC<POReceiptSectionProps> = ({
  po,
  showReceiveForm,
  setShowReceiveForm,
  onReceiveSuccess,
  onExport
}) => {
  const [form] = SWTForm.useForm<ItemFormValues>();
  const [selectedVariantIds, setSelectedVariantIds] = useState<string[]>([]);
  const [isReceiving, setIsReceiving] = useState(false);

  // Pagination for receipts history
  const [receiptPage, setReceiptPage] = useState(1);
  const [receiptPageSize, setReceiptPageSize] = useState(6);
  const { receipts, total: totalReceipts, isLoading: isLoadingReceipts } = usePurchaseOrderReceipts(po.id, receiptPage, receiptPageSize);

  const pendingItems = po.items?.filter((i) => i.receivedQty < i.orderedQty) ?? [];
  const hasReceived = po.items?.some(i => i.receivedQty > 0);

  useEffect(() => {
    if (showReceiveForm && pendingItems.length > 0) {
      const initialVals: Partial<ItemFormValues> = {};
      pendingItems.forEach((item) => {
        initialVals[`batch_${item.variantId}`] = `LOT-${dayjs().format("YYMMDD")}`;
        initialVals[`qty_${item.variantId}`] = item.orderedQty - item.receivedQty;
      });
      form.setFieldsValue(initialVals);
      setSelectedVariantIds(pendingItems.map((i) => i.variantId));
    }
  }, [showReceiveForm, po]);

  const handleSaveReceiveStock = async () => {
    try {
      const values = await form.validateFields();
      if (selectedVariantIds.length === 0) {
        showNotificationWarning("Vui lòng chọn ít nhất 1 mặt hàng để nhập kho!");
        return;
      }

      setIsReceiving(true);
      const items: any[] = [];
      for (const variantId of selectedVariantIds) {
        const poItem = po.items?.find((i) => i.variantId === variantId);
        if (!poItem) continue;

        const qty = values[`qty_${variantId}`];
        const batchNumber = values[`batch_${variantId}`];
        const expiryDayjs = values[`expiry_${variantId}`];
        const mfgDayjs = values[`mfg_${variantId}`];

        if (!qty || !batchNumber || !expiryDayjs) continue;

        items.push({
          variantId,
          quantity: qty,
          batchNumber,
          expiryDate: expiryDayjs.toDate(),
          manufacturingDate: mfgDayjs ? mfgDayjs.toDate() : undefined,
          costPrice: poItem.costPrice,
          note: `Nhập hàng từ PO ${po.code}`,
        });
      }

      if (items.length === 0) {
        showNotificationWarning("Không có mặt hàng hợp lệ để nhập kho!");
        return;
      }

      await receiveStock({ poId: po.id, items });
      showNotificationSuccess(`Đã nhập thành công ${items.length} mặt hàng!`);
      setShowReceiveForm(false);
      onReceiveSuccess();
    } catch (e: any) {
      if (e.errorFields) return; // Form validation error
      showNotificationError("Lỗi khi nhập kho!");
    } finally {
      setIsReceiving(false);
    }
  };

  if (!hasReceived && !showReceiveForm && po.status === "COMPLETED") return null;

  return (
    <div className="admin-card-form p-6 flex flex-col gap-4 animate-slide-up">
      <div className="flex items-center justify-between px-2">
        <h3 className="admin-section-heading font-bold flex items-center gap-2 text-sm uppercase tracking-wider">
          2. Thông tin thực nhận (Stock Receipt)
        </h3>
        {hasReceived && !showReceiveForm && (
          <div className="flex gap-2.5">
            <SWTButton
              icon={<FileText size={18} />}
              onClick={() => onExport("pdf", true)}
              className="!bg-red-500/10 !border-red-500/20 !text-red-600 dark:!text-red-400 !rounded-xl font-bold !h-10 pl-4 pr-5 hover:!bg-red-500/20 transition-all border shadow-sm"
            >
              PDF
            </SWTButton>
            <SWTButton
              icon={<FileSpreadsheet size={18} />}
              onClick={() => onExport("excel", true)}
              className="!bg-emerald-500/10 !border-emerald-500/20 !text-emerald-600 dark:!text-emerald-400 !rounded-xl font-bold !h-10 pl-4 pr-5 hover:!bg-emerald-500/20 transition-all border shadow-sm"
            >
              Excel
            </SWTButton>
          </div>
        )}
      </div>

      {showReceiveForm ? (
        <SWTForm form={form} layout="vertical">
          <div className="admin-table-wrap shadow-sm p-4">
            <SWTTable
              dataSource={pendingItems}
              rowKey="variantId"
              pagination={false}
              className="dark:[&_.ant-table]:!bg-transparent [&_.ant-table-thead_th]:!py-3 [&_.ant-table-tbody_td]:!py-2"
              rowClassName={(record: any) => selectedVariantIds.includes(record.variantId) ? "bg-emerald-500/5 transition-all" : "opacity-60 transition-all"}
              scroll={{ x: 1100 }} // Scroll ngang nếu màn hình nhỏ vì bảng này khá nhiều cột
              columns={[
                {
                  title: (
                    <div className="flex justify-center">
                      <SWTCheckbox
                        checked={selectedVariantIds.length === pendingItems.length && pendingItems.length > 0}
                        onChange={(e) => setSelectedVariantIds(e.target.checked ? pendingItems.map(i => i.variantId) : [])}
                      />
                    </div>
                  ),
                  key: "selection",
                  width: COLUMN_WIDTH.checkbox,
                  align: "center",
                  render: (_: any, record: any) => (
                    <SWTCheckbox
                      checked={selectedVariantIds.includes(record.variantId)}
                      onChange={(e) => setSelectedVariantIds(prev => e.target.checked ? [...prev, record.variantId] : prev.filter(id => id !== record.variantId))}
                    />
                  )
                },
                {
                  title: "Sản phẩm",
                  key: "product",
                  ellipsis: true,
                  render: (_: any, record: any) => (
                    <div 
                      className="flex items-center gap-3 overflow-hidden"
                      title={record.variant?.product?.name}
                    >
                      <div className="admin-image-placeholder w-9 h-9 rounded-lg flex items-center justify-center shrink-0 overflow-hidden relative">
                        {record.variant?.image ? (
                          <Image
                            src={record.variant.image}
                            alt={record.variant?.product?.name || "Product"}
                            fill
                            className="object-cover"
                            sizes="36px"
                            unoptimized
                          />
                        ) : (
                          <Layers size={16} className="text-text-muted" />
                        )}
                      </div>
                      <div className="admin-section-heading font-medium truncate">
                        {record.variant?.product?.name}
                      </div>
                    </div>
                  )
                },
                {
                  title: "Biến thể",
                  key: "variant",
                  width: COLUMN_WIDTH.variant,
                  render: (_: any, record: any) => {
                    const variantName = [record.variant?.color, record.variant?.size].filter(Boolean).join(" - ") || "Tiêu chuẩn";
                    return <div className="admin-text-sub">{variantName}</div>;
                  }
                },
                {
                  title: "SKU",
                  key: "sku",
                  width: COLUMN_WIDTH.sku,
                  ellipsis: true,
                  render: (_: any, record: any) => (
                    <div className="truncate admin-text-sub" title={record.variant?.sku}>
                      {record.variant?.sku || "-"}
                    </div>
                  )
                },
                {
                  title: "Tiến độ",
                  key: "progress",
                  align: "center",
                  width: COLUMN_WIDTH.progress,
                  render: (_: any, record: any) => (
                    <div className="admin-subsection text-[11px] font-bold py-1 px-2 inline-block">
                      <span className="text-emerald-500 dark:text-emerald-400">{record.receivedQty}</span>
                      <span className="admin-text-muted mx-1">/</span>
                      <span className="admin-text-sub">{record.orderedQty}</span>
                    </div>
                  )
                },
                {
                  title: "Nhập kho",
                  key: "qty",
                  width: COLUMN_WIDTH.qty,
                  align: "right",
                  render: (_: any, record: any) => {
                    const isSelected = selectedVariantIds.includes(record.variantId);
                    return (
                      <SWTFormItem name={`qty_${record.variantId}`} rules={[{ required: isSelected }]} className="!mb-0">
                        <SWTInputNumber
                          min={1}
                          max={record.orderedQty - record.receivedQty}
                          disabled={!isSelected}
                          className="!w-full !rounded-xl font-bold !text-center !h-9"
                        />
                      </SWTFormItem>
                    );
                  }
                },
                {
                  title: "Số lô",
                  key: "batch",
                  width: COLUMN_WIDTH.batch,
                  render: (_: any, record: any) => {
                    const isSelected = selectedVariantIds.includes(record.variantId);
                    return (
                      <SWTFormItem name={`batch_${record.variantId}`} rules={[{ required: isSelected }]} className="!mb-0">
                        <SWTInput
                          disabled={true}
                          showCount ={false}
                          className="!w-full !rounded-xl text-xs uppercase !bg-white dark:!bg-slate-800/50 !border-slate-200 dark:!border-slate-700/50 !h-9 px-2"
                          placeholder="BATCH..."
                        />
                      </SWTFormItem>
                    );
                  }
                },
                {
                  title: "Ngày SX *",
                  key: "mfg",
                  width: COLUMN_WIDTH.date,
                  render: (_: any, record: any) => {
                    const isSelected = selectedVariantIds.includes(record.variantId);
                    return (
                      <SWTFormItem
                        name={`mfg_${record.variantId}`}
                        rules={[{ required: isSelected, message: "Nhập ngày SX" }]}
                        className="!mb-0"
                      >
                        <SWTDatePicker
                          format="DD/MM/YYYY"
                          showToday={false}
                          disabled={!isSelected}
                          placeholder="NSX"
                          disabledDate={(d) => d && d.isAfter(dayjs().subtract(1, "day"))}
                          className="!w-full !rounded-xl !bg-white dark:!bg-slate-800/50 !border-slate-200 dark:!border-slate-700/50 !h-9 [&_input]:!text-xs"
                        />
                      </SWTFormItem>
                    );
                  }
                },
                {
                  title: "Hạn sử dụng *",
                  key: "expiry",
                  width: COLUMN_WIDTH.date,
                  render: (_: any, record: any) => {
                    const isSelected = selectedVariantIds.includes(record.variantId);
                    return (
                      <SWTFormItem name={`expiry_${record.variantId}`} rules={[{ required: isSelected , message: "Nhập hạn sử dụng" }]} className="!mb-0">
                        <SWTDatePicker
                          format="DD/MM/YYYY"
                          showToday={false}
                          disabledDate={(d) => d && !d.isAfter(dayjs(), "day")}
                          placeholder="HSD"
                          className="!w-full !rounded-xl !bg-white dark:!bg-slate-800/50 !border-slate-200 dark:!border-slate-700/50 !h-9 [&_input]:!text-xs"
                        />
                      </SWTFormItem>
                    );
                  }
                }
              ]}
            />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <SWTButton
              size="sm"
              icon={<X size={16} />}
              onClick={() => setShowReceiveForm(false)}
              className="!bg-bg-muted !border-border-default !text-text-muted hover:opacity-80 !rounded-xl !w-auto font-bold transition-all px-6"
            >
              Hủy bỏ
            </SWTButton>
            <SWTButton
              size="sm"
              type="primary"
              icon={<Save size={16} />}
              loading={isReceiving}
              onClick={handleSaveReceiveStock}
              className="!bg-emerald-500/10 !border-emerald-500/20 !text-emerald-600 dark:!text-emerald-400 hover:!bg-emerald-500/20 !rounded-xl !font-bold shadow-sm !w-auto transition-all px-8"
            >
              Lưu nhập kho
            </SWTButton>
          </div>
        </SWTForm>
      ) : (
        <div className="admin-table-wrap shadow-sm p-4">
          <SWTTable
            dataSource={receipts}
            loading={isLoadingReceipts}
            rowKey={(r: any, idx?: number) => `receipt_${idx ?? Math.random()}`}
            pagination={{
              page: receiptPage,
              fetch: receiptPageSize,
              totalCount: totalReceipts || 0,
              pageSizeOptions: ["6", "10", "20", "50"],
              onChange: (p: number, f: number) => {
                setReceiptPage(p);
                if (f && f !== receiptPageSize) setReceiptPageSize(f);
              }
            }}
            className="dark:[&_.ant-table]:!bg-transparent [&_.ant-table-thead_th]:!py-3 [&_.ant-table-tbody_td]:!py-2"
            locale={{ emptyText: <div className="py-12 text-center admin-text-muted italic font-medium">Chưa có lịch sử nhập kho thực tế.</div> }}
            columns={[
              {
                title: "Sản phẩm",
                dataIndex: "variantId",
                key: "product",
                ellipsis: true,
                render: (_: string, record: any) => (
                  <div 
                    className="flex items-center gap-3 overflow-hidden"
                    title={record.variant?.product?.name}
                  >
                    <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0 overflow-hidden relative shadow-sm">
                      {record.variant?.image ? (
                        <Image
                          src={record.variant.image}
                          alt={record.variant?.product?.name || "Product"}
                          fill
                          className="object-cover"
                          sizes="36px"
                          unoptimized
                        />
                      ) : (
                        <Layers size={16} className="text-slate-400" />
                      )}
                    </div>
                    <div className="font-medium text-slate-700 dark:text-slate-200 truncate">
                      {record.variant?.product?.name}
                    </div>
                  </div>
                )
              },
              {
                title: "Biến thể",
                key: "variant",
                width: COLUMN_WIDTH.variant,
                render: (_: any, record: any) => {
                  const variantName = [record.variant?.color, record.variant?.size].filter(Boolean).join(" - ") || "Tiêu chuẩn";
                  return <div className="admin-text-sub">{variantName}</div>;
                }
              },
              {
                title: "SKU",
                key: "sku",
                width: COLUMN_WIDTH.sku,
                ellipsis: true,
                render: (_: any, record: any) => (
                  <div className="truncate admin-text-sub" title={record.variant?.sku}>
                    {record.variant?.sku || "-"}
                  </div>
                )
              },
              {
                title: "Số lô",
                dataIndex: "batchNumber",
                key: "batch",
                width: COLUMN_WIDTH.batch,
                render: (val: string) => <div className="admin-text-sub font-medium uppercase text-xs">{val || "-"}</div>
              },
              {
                title: "Ngày sản xuất",
                dataIndex: "manufacturingDate",
                key: "mfg",
                width: COLUMN_WIDTH.date,
                render: (date: string) => <div className="admin-text-muted text-sm">{date ? dayjs(date).format("DD/MM/YYYY") : "-"}</div>
              },
              {
                title: "Hạn sử dụng",
                dataIndex: "expiryDate",
                key: "expiry",
                width: COLUMN_WIDTH.date,
                render: (date: string) => <div className="admin-section-heading font-medium text-sm">{dayjs(date).format("DD/MM/YYYY")}</div>
              },
              {
                title: "SL nhận",
                dataIndex: "quantity",
                key: "quantity",
                align: "right",
                width: COLUMN_WIDTH.qty,
                render: (qty: number) => <div className="font-bold text-emerald-600 dark:text-emerald-400">{qty}</div>
              }
            ]}
          />
        </div>
      )}
    </div>
  );
};

export default POReceiptSection;