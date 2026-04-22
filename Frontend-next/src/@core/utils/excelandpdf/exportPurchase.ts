import { POListItemDto } from "@/src/services/models/purchase/output.dto";
import { loadExportLibs, setupPdfFont, getPdfTableStyles } from "./exportGeneral";

export const exportPurchasesToExcel = async (data: POListItemDto[]) => {
  const { XLSX } = await loadExportLibs();

  const wsData: any[][] = [
    ["DANH SÁCH ĐƠN NHẬP HÀNG (PO)"],
    ["Ngày xuất:", new Date().toLocaleString("vi-VN")],
    [],
    ["#", "Mã vận đơn", "Nhà cung cấp", "Tổng tiền", "Ghi chú", "Mức ưu tiên", "Trạng thái", "Người tạo", "Ngày tạo"]
  ];

  data.forEach((item, index) => {
    wsData.push([
      index + 1,
      item.code,
      item.brand?.name || "N/A",
      item.totalAmount,
      item.note || "",
      item.priority,
      item.status,
      item.creator?.full_name || "N/A",
      new Date(item.createdAt).toLocaleString("vi-VN")
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  ws['!cols'] = [
    { wch: 5 }, { wch: 15 }, { wch: 30 }, { wch: 15 }, { wch: 30 }, { wch: 12 }, { wch: 15 }, { wch: 20 }, { wch: 20 }
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Purchases");
  XLSX.writeFile(wb, `Danh-sach-Nhap-Hang-${new Date().getTime()}.xlsx`);
};

export const exportPurchasesToPDF = async (data: POListItemDto[]) => {
  const { jsPDF, autoTable } = await loadExportLibs();
  const doc = new jsPDF('landscape');
  await setupPdfFont(doc);

  const PAGE_WIDTH = doc.internal.pageSize.getWidth();
  doc.setFontSize(18);
  doc.text("DANH SÁCH ĐƠN NHẬP HÀNG", PAGE_WIDTH / 2, 20, { align: "center" });

  doc.setFontSize(10);
  doc.text(`Ngày xuất: ${new Date().toLocaleString("vi-VN")}`, 14, 28);

  const tableColumn = ["#", "Mã đơn", "Nhà cung cấp", "Tổng tiền", "Ưu tiên", "Trạng thái", "Người tạo", "Ngày tạo"];
  const tableRows = data.map((item, index) => [
      index + 1,
      item.code,
      item.brand?.name || "N/A",
      item.totalAmount.toLocaleString("vi-VN"),
      item.priority,
      item.status,
      item.creator?.full_name || "N/A",
      new Date(item.createdAt).toLocaleDateString("vi-VN")
  ]);

  autoTable(doc, {
    startY: 35,
    head: [tableColumn],
    body: tableRows,
    ...getPdfTableStyles(doc),
  });

  doc.save(`Danh-sach-Nhap-Hang-${new Date().getTime()}.pdf`);
};
