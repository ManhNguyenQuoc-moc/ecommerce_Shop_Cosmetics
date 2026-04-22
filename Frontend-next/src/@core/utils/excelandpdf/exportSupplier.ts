import { BrandResponseDto } from "@/src/services/models/brand/output.dto";
import { loadExportLibs, setupPdfFont, getPdfTableStyles } from "./exportGeneral";

/**
 * Xuất danh sách nhà cung cấp ra file Excel
 */
export const exportSuppliersToExcel = async (data: BrandResponseDto[]) => {
  const { XLSX } = await loadExportLibs();

  const wsData: (string | number)[][] = [
    ["DANH SÁCH NHÀ CUNG CẤP"],
    ["Ngày xuất:", new Date().toLocaleString("vi-VN")],
    [],
    ["#", "Tên nhà cung cấp", "Email", "Số điện thoại", "Địa chỉ", "Ngày tạo"]
  ];

  data.forEach((item, index) => {
    wsData.push([
      index + 1,
      item.name,
      item.email || "N/A",
      item.phone || "N/A",
      item.address || "N/A",
      new Date(item.createdAt).toLocaleDateString("vi-VN")
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths
  ws['!cols'] = [
    { wch: 5 },   // #
    { wch: 30 },  // Tên
    { wch: 25 },  // Email
    { wch: 15 },  // Phone
    { wch: 40 },  // Địa chỉ
    { wch: 15 }   // Ngày tạo
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Suppliers");
  XLSX.writeFile(wb, `Danh-sach-Nha-Cung-Cap-${new Date().getTime()}.xlsx`);
};

/**
 * Xuất danh sách nhà cung cấp ra file PDF (Hỗ trợ Tiếng Việt)
 */
export const exportSuppliersToPDF = async (data: BrandResponseDto[]) => {
  const { jsPDF, autoTable } = await loadExportLibs();
  const doc = new jsPDF();
  await setupPdfFont(doc);

  // Tiêu đề & Cấu hình PDF
  const PAGE_WIDTH = doc.internal.pageSize.getWidth();
  doc.setFontSize(18);
  doc.text("DANH SÁCH NHÀ CUNG CẤP", PAGE_WIDTH / 2, 20, { align: "center" });

  doc.setFontSize(10);
  doc.text(`Ngày xuất: ${new Date().toLocaleString("vi-VN")}`, 14, 28);

  const tableColumn = ["#", "Tên nhà cung cấp", "Email", "Số điện thoại", "Địa chỉ", "Ngày tạo"];
  const tableRows = data.map((item, index) => [
      index + 1,
      item.name || "",
      item.email || "N/A",
      item.phone || "N/A",
      item.address || "N/A",
      new Date(item.createdAt).toLocaleDateString("vi-VN")
  ]);

  autoTable(doc, {
    startY: 35,
    head: [tableColumn],
    body: tableRows,
    ...getPdfTableStyles(doc),
  });

  doc.save(`Danh-sach-Nha-Cung-Cap-${new Date().getTime()}.pdf`);
};
