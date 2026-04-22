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
import { parseProductExcel, downloadProductTemplate } from "@/src/@core/utils/excelandpdf/importProduct";
import { CreateProductInput } from "@/src/services/models/product/input.dto";
import { bulkImportProducts } from "@/src/services/admin/product/product.service";

interface ImportProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ImportProductModal({ isOpen, onClose, onSuccess }: ImportProductModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<CreateProductInput[]>([]);
  const [isParsing, setIsParsing] = useState(false);
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
      const data = await parseProductExcel(selectedFile);
      setParsedData(data);
      setStep(2);
    } catch (err: any) {
      showNotificationError(err.message || "Lỗi khi đọc file Excel");
      setFile(null);
    } finally {
      setIsParsing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleImport = async () => {
    setIsImporting(true);
    try {
      const response = await bulkImportProducts(parsedData);
      setResults({
        success: response.successCount,
        skipped: response.skipCount,
        errors: response.errors
      });
      showNotificationSuccess(`Đã xử lý ${parsedData.length} sản phẩm!`);
      if (response.successCount > 0) onSuccess?.();
    } catch (err: any) {
      showNotificationError(err.message || "Lỗi khi nhập dữ liệu");
    } finally {
      setIsImporting(false);
    }
  };

  const resetModal = () => {
    setStep(1);
    setFile(null);
    setParsedData([]);
    setResults(null);
    setPagination({ page: 1, pageSize: 6 });
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <span className="font-bold text-slate-700 dark:text-slate-200">{text}</span>
    },
    {
      title: "Thương hiệu",
      dataIndex: "brandId",
      key: "brand",
      render: (text: string) => <span>{text || "-"}</span>
    },
    {
      title: "Danh mục",
      dataIndex: "categoryId",
      key: "category",
      render: (text: string) => <span>{text || "-"}</span>
    },
    {
      title: "Giá bán",
      key: "price",
      align: "right" as const,
      render: (_: any, record: CreateProductInput) => {
        const price = record.variants?.[0]?.price || 0;
        return <span className="text-brand-600 font-semibold">{new Intl.NumberFormat('vi-VN').format(price)} đ</span>
      }
    },
    {
      title: "Biến thể",
      key: "variantsCount",
      align: "center" as const,
      render: (_: any, record: CreateProductInput) => <span>{record.variants?.length || 0}</span>
    }
  ];

  return (
    <SWTModal
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-500/10 rounded-lg">
            <FileSpreadsheet size={24} className="text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-0">Nhập Sản Phẩm Từ Excel</h3>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-0.5">Bulk Import Module</p>
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
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 p-4 rounded-2xl flex gap-3">
                  <Info className="text-blue-500 shrink-0" size={20} />
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    <p className="font-bold mb-1">Hướng dẫn nhanh:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Tải file mẫu để biết cấu trúc các cột dữ liệu.</li>
                      <li>Để nhập nhiều biến thể cho 1 sản phẩm, hãy điền trùng <b>Tên sản phẩm</b> ở các dòng liên tiếp.</li>
                      <li>Hệ thống sẽ dựa vào <b>Tên sản phẩm</b> và <b>SKU</b> để kiểm tra trùng lặp.</li>
                    </ul>
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
                      <RefreshCw size={32} className="text-brand-500 animate-spin" />
                    ) : (
                      <Upload size={32} className="text-slate-400 group-hover:text-brand-500" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-700 dark:text-slate-200">Chọn file Excel hoặc kéo thả vào đây</p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Hỗ trợ .xlsx, .xls, .csv (Tối đa 10MB)</p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <SWTButton
                    type="text"
                    icon={<Download size={18} />}
                    onClick={downloadProductTemplate}
                    className="!text-brand-600 font-bold hover:!bg-brand-500/10 !h-11 !px-6 !rounded-xl"
                  >
                    Tải File Excel Mẫu
                  </SWTButton>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-0">Xem trước dữ liệu ({parsedData.length} sản phẩm)</h4>
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
                  rowKey="name"
                  pagination={{
                    totalCount: parsedData.length,
                    page: pagination.page,
                    fetch: pagination.pageSize,
                    onChange: (p, f) => setPagination({ page: p, pageSize: f })
                  }}
                  className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden"
                />

                <div className="flex justify-end gap-3 mt-4">
                  <SWTButton
                    onClick={handleClose}
                    className="!h-11 !px-8 !rounded-xl"
                  >
                    Hủy
                  </SWTButton>
                  <SWTButton
                    color="primary"
                    onClick={handleImport}
                    loading={isImporting}
                    className="!h-11 !px-12 !rounded-xl !bg-brand-500 !text-white font-bold shadow-lg shadow-brand-500/20"
                  >
                    Tiến hành Nhập ({parsedData.length} SP)
                  </SWTButton>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-6 py-4 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 size={40} className="text-emerald-500" />
            </div>

            <div className="text-center">
              <h4 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">Xử Lý Hoàn Tất!</h4>
              <p className="text-slate-500">Kết quả xử lý file sản phẩm</p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 p-4 rounded-2xl text-center">
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-1">Thành công</p>
                <p className="text-3xl font-black text-emerald-700 dark:text-emerald-300">{results.success}</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 p-4 rounded-2xl text-center">
                <p className="text-sm text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider mb-1">Bỏ qua (Trùng)</p>
                <p className="text-3xl font-black text-amber-700 dark:text-amber-300">{results.skipped}</p>
              </div>
            </div>

            {results.errors.length > 0 && (
              <div className="w-full max-h-48 overflow-y-auto bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/20 rounded-2xl p-4">
                <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <AlertCircle size={14} /> Danh sách lỗi ({results.errors.length}):
                </p>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                  {results.errors.map((err, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="opacity-50">•</span>
                      <span>{err}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <SWTButton
              color="primary"
              onClick={handleClose}
              className="!w-full !h-12 !rounded-xl font-bold mt-4"
            >
              Đóng và Quay lại danh sách
            </SWTButton>
          </div>
        )}
      </div>
    </SWTModal>
  );
}
