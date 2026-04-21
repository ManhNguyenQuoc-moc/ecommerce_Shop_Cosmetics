"use client";

import { useState, useRef } from "react";
import {
  FileSpreadsheet,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Info
} from "lucide-react";
import SWTModal from "@/src/@core/component/AntD/SWTModal";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import SWTTable from "@/src/@core/component/AntD/SWTTable";
import { showNotificationSuccess, showNotificationError } from "@/src/@core/utils/message";
import { parseVariantExcel, downloadVariantTemplate, ImportedVariant } from "@/src/@core/utils/importVariant";
import { bulkImportVariants } from "@/src/services/admin/product/product.service";

interface ImportVariantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ImportVariantModal({ isOpen, onClose, onSuccess }: ImportVariantModalProps) {
  const [step, setStep] = useState(1); // 1: Upload, 2: Preview, 3: Results
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<ImportedVariant[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [results, setResults] = useState<{ success: number; skipped: number; errors: string[] } | null>(null);

  // Pagination state for preview table
  const [pagination, setPagination] = useState({ page: 1, pageSize: 6 });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsParsing(true);
    try {
      const data = await parseVariantExcel(selectedFile);
      setParsedData(data);
      setStep(2);
      showNotificationSuccess("Đọc file thành công!");
    } catch (err: any) {
      showNotificationError(err.message || "Lỗi khi đọc file Excel");
      setFile(null);
    } finally {
      setIsParsing(false);
    }
  };

  const handleImport = async () => {
    setIsImporting(true);
    try {
      const response = await bulkImportVariants(parsedData);
      setResults({
        success: response.successCount,
        skipped: response.skipCount,
        errors: response.errors
      });
      setStep(3);
      if (response.successCount > 0) {
        onSuccess?.();
      }
    } catch (err: any) {
      showNotificationError(err.message || "Lỗi khi nhập dữ liệu");
    } finally {
      setIsImporting(false);
    }
  };

  const reset = () => {
    setStep(1);
    setFile(null);
    setParsedData([]);
    setResults(null);
    setPagination({ page: 1, pageSize: 6 });
  };

  const handleClose = () => {
    onClose();
    setTimeout(reset, 300);
  };

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      key: "productName",
      render: (val: string) => <span className="font-bold text-slate-700 dark:text-slate-200">{val}</span>
    },
    {
      title: "Phân loại",
      key: "info",
      render: (_: any, record: ImportedVariant) => (
        <div className="flex flex-col gap-0.5">
          {record.color && <span className="text-xs text-slate-500">Màu: {record.color}</span>}
          {record.size && <span className="text-xs text-slate-500">Kích cỡ: {record.size}</span>}
        </div>
      )
    },
    {
      title: "Mã SKU",
      dataIndex: "sku",
      key: "sku",
      render: (val: string) => <span className="font-mono text-xs">{val || "Tự động"}</span>
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      key: "price",
      align: "right" as const,
      render: (val: number) => <span className="text-brand-600 font-semibold">{new Intl.NumberFormat('vi-VN').format(val)} đ</span>
    },
    {
      title: "Nhãn",
      dataIndex: "statusName",
      key: "statusName",
      align: "center" as const,
      render: (val: string) => (
        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-[10px] font-bold">
          {val}
        </span>
      )
    }
  ];

  return (
    <SWTModal
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center">
            <FileSpreadsheet className="text-brand-500" size={22} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-0">Nhập Biến Thể Từ Excel</h3>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-0">Bulk Variant Module</p>
          </div>
        </div>
      }
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      width={results ? 600 : 1000}
      className="[&_.ant-modal-header]:!px-6 [&_.ant-modal-header]:!pt-6 [&_.ant-modal-body]:!px-6 [&_.ant-modal-footer]:!px-6 [&_.ant-modal-footer]:!pb-6 sm:[&_.ant-modal-header]:!px-8 sm:[&_.ant-modal-header]:!pt-8 sm:[&_.ant-modal-body]:!px-8 sm:[&_.ant-modal-footer]:!px-8 sm:[&_.ant-modal-footer]:!pb-8 dark:[&_.ant-modal-content]:!bg-slate-900/90 dark:[&_.ant-modal-content]:!border dark:[&_.ant-modal-content]:!border-brand-500/20 dark:[&_.ant-modal-header]:!bg-transparent dark:[&_.ant-modal-title]:!bg-transparent"
    >
      <div className="py-6 flex flex-col gap-6">
        {!results ? (
          <>
            {step === 1 ? (
              <div className="flex flex-col gap-6">
                <div className="bg-brand-50 dark:bg-brand-500/5 p-4 rounded-2xl border border-brand-100 dark:border-brand-500/20 flex gap-4 items-start">
                  <div className="w-10 h-10 bg-brand-500 text-white rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/30">
                    <Info size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-brand-700 dark:text-brand-400 mb-0.5">Hướng dẫn nhập liệu</h4>
                    <p className="text-sm text-brand-600/80 dark:text-brand-400/60 mb-0 leading-relaxed">
                      Vui lòng sử dụng file mẫu để đảm bảo dữ liệu chính xác. Hệ thống sẽ tự động ghép nối với Sản phẩm dựa trên <strong>Tên sản phẩm</strong>. Nếu sản phẩm chưa có mã SKU, hệ thống sẽ tự động tạo chuỗi ngẫu nhiên.
                    </p>
                  </div>
                </div>

                <div
                  className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 flex flex-col items-center justify-center gap-4 hover:border-brand-500/50 hover:bg-brand-500/5 transition-all cursor-pointer group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileChange}
                  />
                  <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    {isParsing ? (
                      <RefreshCw size={40} className="text-brand-500 animate-spin" />
                    ) : (
                      <Upload size={40} className="text-slate-400 group-hover:text-brand-500 transition-colors" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-1">
                      {isParsing ? "Đang xử lý file..." : "Nhấp hoặc kéo thả file vào đây"}
                    </p>
                    <p className="text-sm text-slate-400">Hỗ trợ Excel (.xlsx, .xls) hoặc CSV</p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <SWTButton
                    type="text"
                    icon={<Download size={18} />}
                    onClick={downloadVariantTemplate}
                    className="!text-brand-600 font-bold hover:!bg-brand-500/10 !h-11 !px-6 !rounded-xl"
                  >
                    Tải file mẫu (Template)
                  </SWTButton>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-0">Xem trước dữ liệu ({parsedData.length} biến thể)</h4>
                    <p className="text-sm text-slate-500">{file?.name}</p>
                  </div>
                  <div className="flex-1 flex justify-end">
                    <SWTButton
                      variant="text"
                      onClick={() => setStep(1)}
                      className="!h-9 !rounded-lg !px-4 !w-40"
                    >
                      Chọn file khác
                    </SWTButton>
                  </div>
                </div>

                <SWTTable
                  columns={columns}
                  dataSource={parsedData}
                  rowKey={(record: ImportedVariant) => `${record.productName}-${record.sku}-${record.color}`}
                  pagination={{
                    totalCount: parsedData.length,
                    page: pagination.page,
                    fetch: pagination.pageSize,
                    onChange: (page: number) => setPagination({ ...pagination, page })
                  }}
                />

                <div className="flex justify-end gap-3 mt-4">
                  <SWTButton
                    onClick={handleClose}
                    className="!h-11 !px-8 !rounded-xl"
                  >
                    Hủy bỏ
                  </SWTButton>
                  <SWTButton
                    color="primary"
                    onClick={handleImport}
                    loading={isImporting}
                    className="!h-11 !px-12 !rounded-xl !bg-brand-500 !text-white font-bold shadow-lg shadow-brand-500/20"
                  >
                    Tiến hành Nhập ({parsedData.length} Biến thể)
                  </SWTButton>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-6 py-4 animate-fade-in">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 size={40} className="text-emerald-500" />
            </div>

            <div className="text-center">
              <h4 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">Xử Lý Hoàn Tất!</h4>
              <p className="text-slate-500">Kết quả xử lý file biến thể</p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="bg-emerald-50 dark:bg-emerald-500/5 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 text-center">
                <p className="text-xs uppercase tracking-widest text-emerald-600 font-bold mb-1">Thành công</p>
                <p className="text-3xl font-black text-emerald-600">{results.success}</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-500/5 p-4 rounded-2xl border border-amber-100 dark:border-amber-500/20 text-center">
                <p className="text-xs uppercase tracking-widest text-amber-600 font-bold mb-1">Bị từ chối</p>
                <p className="text-3xl font-black text-amber-600">{results.skipped}</p>
              </div>
            </div>

            {results.errors.length > 0 && (
              <div className="w-full bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 max-h-[250px] overflow-y-auto">
                <h5 className="flex items-center gap-2 text-rose-500 font-bold text-sm uppercase tracking-tight mb-4">
                  <AlertCircle size={16} />
                  Danh sách lỗi ({results.errors.length}):
                </h5>
                <ul className="flex flex-col gap-3 mb-0">
                  {results.errors.map((err, i) => (
                    <li key={i} className="text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm leading-relaxed">
                      • {err}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <SWTButton
              color="primary"
              onClick={handleClose}
              className="!w-full !h-12 !rounded-xl font-bold mt-4 !bg-brand-500 !text-white"
            >
              Đóng và làm mới danh sách
            </SWTButton>
          </div>
        )}
      </div>
    </SWTModal>
  );
}
