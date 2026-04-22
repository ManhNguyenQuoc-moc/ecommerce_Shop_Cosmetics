import { VoucherResponseDto } from "@/src/services/models/voucher/output.dto";
import { loadExportLibs, setupPdfFont, getPdfTableStyles } from "./exportGeneral";

export const exportVouchersToExcel = async (data: VoucherResponseDto[]) => {
  const { XLSX } = await loadExportLibs();

  const wsData: any[][] = [
    ["DANH SÁCH VOUCHER / DISCOUNTS"],
    ["Ngày xuất:", new Date().toLocaleString("vi-VN")],
    [],
    ["#", "Mã Voucher", "Chương trình", "Loại", "Giảm giá", "Đơn tối thiểu", "Đã dùng", "Hạn dùng", "Trạng thái"]
  ];

  data.forEach((item, index) => {
    wsData.push([
      index + 1,
      item.code,
      item.program_name || "N/A",
      item.type,
      item.type === "PERCENTAGE" ? `${item.discount}%` : item.discount.toLocaleString("vi-VN"),
      item.min_order_value?.toLocaleString("vi-VN") || 0,
      `${item.used_count}/${item.usage_limit}`,
      `${new Date(item.valid_from).toLocaleDateString("vi-VN")} - ${new Date(item.valid_until).toLocaleDateString("vi-VN")}`,
      item.isActive ? "Hoạt động" : "Tắt"
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  ws['!cols'] = [{ wch: 5 }, { wch: 15 }, { wch: 30 }, { wch: 15 }, { wch: 12 }, { wch: 15 }, { wch: 12 }, { wch: 25 }, { wch: 12 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Vouchers");
  XLSX.writeFile(wb, `Danh-sach-Voucher-${new Date().getTime()}.xlsx`);
};

export const exportVouchersToPDF = async (data: VoucherResponseDto[]) => {
  const { jsPDF, autoTable } = await loadExportLibs();
  const doc = new jsPDF('landscape');
  await setupPdfFont(doc);

  const PAGE_WIDTH = doc.internal.pageSize.getWidth();
  doc.setFontSize(18);
  doc.text("DANH SÁCH VOUCHER", PAGE_WIDTH / 2, 20, { align: "center" });

  doc.setFontSize(10);
  doc.text(`Ngày xuất: ${new Date().toLocaleString("vi-VN")}`, 14, 28);

  const tableColumn = ["#", "Mã", "Chương trình", "Loại", "Giảm", "Đơn tối thiểu", "Sử dụng", "Hạn dùng", "Trạng thái"];
  const tableRows = data.map((item, index) => [
      index + 1,
      item.code,
      item.program_name || "N/A",
      item.type,
      item.type === "PERCENTAGE" ? `${item.discount}%` : item.discount.toLocaleString("vi-VN"),
      item.min_order_value?.toLocaleString("vi-VN") || 0,
      `${item.used_count}/${item.usage_limit}`,
      `${new Date(item.valid_from).toLocaleDateString("vi-VN")} - ${new Date(item.valid_until).toLocaleDateString("vi-VN")}`,
      item.isActive ? "Bật" : "Tắt"
  ]);

  autoTable(doc, {
    startY: 35,
    head: [tableColumn],
    body: tableRows,
    ...getPdfTableStyles(doc),
  });

  doc.save(`Danh-sach-Voucher-${new Date().getTime()}.pdf`);
};
