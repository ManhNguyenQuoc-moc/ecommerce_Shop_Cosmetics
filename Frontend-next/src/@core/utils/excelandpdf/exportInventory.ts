import { InventoryBatchDto } from "@/src/services/models/inventory/output.dto";
import { loadExportLibs, setupPdfFont, getPdfTableStyles } from "./exportGeneral";

export const exportInventoryToExcel = async (data: InventoryBatchDto[]) => {
  const { XLSX } = await loadExportLibs();

  const wsData: any[][] = [
    ["DANH SÁCH TỒN KHO THEO LÔ"],
    ["Ngày xuất:", new Date().toLocaleString("vi-VN")],
    [],
    ["#", "Sản phẩm", "SKU", "Phân loại", "Lô hàng", "Giá nhập", "Tồn kho", "Tổng Nhập", "Tổng Xuất", "Hạn dùng", "Trạng thái"]
  ];

  data.forEach((item, index) => {
    const variantStr = [item.variant?.color, item.variant?.size].filter(Boolean).join(" - ") || "Tiêu chuẩn";
    wsData.push([
      index + 1,
      item.variant?.product?.name || "N/A",
      item.variant?.sku || "N/A",
      variantStr,
      item.batchNumber,
      item.costPrice,
      item.quantity,
      item.totalIn,
      item.totalOut,
      new Date(item.expiryDate).toLocaleDateString("vi-VN"),
      item.status
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  ws['!cols'] = [
    { wch: 5 }, { wch: 35 }, { wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 12 }
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Inventory");
  XLSX.writeFile(wb, `Danh-sach-Ton-Kho-${new Date().getTime()}.xlsx`);
};

export const exportInventoryToPDF = async (data: InventoryBatchDto[]) => {
  const { jsPDF, autoTable } = await loadExportLibs();
  const doc = new jsPDF('landscape');
  await setupPdfFont(doc);

  const PAGE_WIDTH = doc.internal.pageSize.getWidth();
  doc.setFontSize(18);
  doc.text("DANH SÁCH CHI TIẾT TỒN KHO", PAGE_WIDTH / 2, 20, { align: "center" });

  doc.setFontSize(10);
  doc.text(`Ngày xuất: ${new Date().toLocaleString("vi-VN")}`, 14, 28);

  const tableColumn = ["#", "Sản phẩm", "SKU", "Phân loại", "Lô hàng", "Giá nhập", "Tồn", "Nhập", "Xuất", "Hạn dùng", "Trạng thái"];
  const tableRows = data.map((item, index) => {
    const variantStr = [item.variant?.color, item.variant?.size].filter(Boolean).join(" - ") || "Std";
    return [
      index + 1,
      item.variant?.product?.name || "N/A",
      item.variant?.sku || "N/A",
      variantStr,
      item.batchNumber,
      item.costPrice.toLocaleString("vi-VN"),
      item.quantity,
      item.totalIn,
      item.totalOut,
      new Date(item.expiryDate).toLocaleDateString("vi-VN"),
      item.status
    ];
  });

  autoTable(doc, {
    startY: 35,
    head: [tableColumn],
    body: tableRows,
    ...getPdfTableStyles(doc),
  });

  doc.save(`Danh-sach-Ton-Kho-${new Date().getTime()}.pdf`);
};
