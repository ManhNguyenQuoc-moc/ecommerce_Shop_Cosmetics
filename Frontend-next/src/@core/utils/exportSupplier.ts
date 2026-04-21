import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { BrandResponseDto } from "@/src/services/models/brand/output.dto";
import { ROBOTO_REGULAR_BASE64 } from "./fontRoboto";

/**
 * Xuất danh sách nhà cung cấp ra file Excel
 */
export const exportSuppliersToExcel = (data: BrandResponseDto[]) => {
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
  const doc = new jsPDF();

  // Nạp font Roboto để hỗ trợ Tiếng Việt
  try {
    if (ROBOTO_REGULAR_BASE64 && ROBOTO_REGULAR_BASE64.length > 200) {
      doc.addFileToVFS("Roboto-Regular.ttf", ROBOTO_REGULAR_BASE64);
      doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
      doc.setFont("Roboto");
    }
  } catch (e) {
    console.error("Lỗi khi nạp font Roboto:", e);
  }

  // Tiêu đề & Cấu hình PDF
  const PAGE_WIDTH = doc.internal.pageSize.getWidth();
  doc.setFontSize(18);
  doc.text("DANH SÁCH NHÀ CUNG CẤP", PAGE_WIDTH / 2, 20, { align: "center" });

  doc.setFontSize(10);
  doc.text(`Ngày xuất: ${new Date().toLocaleString("vi-VN")}`, 14, 28);

  const tableColumn = ["#", "Tên nhà cung cấp", "Email", "Số điện thoại", "Địa chỉ", "Ngày tạo"];
  const tableRows: any[] = [];

  data.forEach((item, index) => {
    tableRows.push([
      index + 1,
      item.name || "",
      item.email || "N/A",
      item.phone || "N/A",
      item.address || "N/A",
      new Date(item.createdAt).toLocaleDateString("vi-VN")
    ]);
  });

  // Sử dụng autoTable trực tiếp
  autoTable(doc, {
    startY: 35,
    head: [tableColumn],
    body: tableRows,
    styles: {
      font: doc.getFont().fontName === "Roboto" ? "Roboto" : "helvetica",
      fontSize: 8
    }
  });

  doc.save(`Danh-sach-Nha-Cung-Cap-${new Date().getTime()}.pdf`);
};
