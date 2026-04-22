import { OrderDto } from "@/src/services/models/order/output.dto";
import { loadExportLibs, setupPdfFont, getPdfTableStyles } from "./exportGeneral";

export const exportOrdersToExcel = async (data: OrderDto[]) => {
  const { XLSX } = await loadExportLibs();

  const wsData: any[][] = [
    ["DANH SÁCH ĐƠN HÀNG"],
    ["Ngày xuất:", new Date().toLocaleString("vi-VN")],
    [],
    ["#", "Mã đơn hàng", "Khách hàng", "Số điện thoại", "Địa chỉ giao hàng", "Phương thức", "Tổng tiền", "Phí ship", "Giảm giá", "Thanh toán", "Trạng thái", "Ngày đặt"]
  ];

  data.forEach((item, index) => {
    wsData.push([
      index + 1,
      item.code,
      item.customer_name,
      item.customer_phone,
      item.shipping_address,
      item.shipping_method,
      item.total_amount,
      item.shipping_fee,
      item.discount_amount || 0,
      `${item.payment_method} (${item.payment_status})`,
      item.current_status,
      new Date(item.createdAt).toLocaleString("vi-VN")
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  ws['!cols'] = [
    { wch: 5 }, { wch: 15 }, { wch: 25 }, { wch: 15 }, { wch: 40 }, { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 12 }, { wch: 20 }, { wch: 15 }, { wch: 20 }
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Orders");
  XLSX.writeFile(wb, `Danh-sach-Don-Hang-${new Date().getTime()}.xlsx`);
};

export const exportOrdersToPDF = async (data: OrderDto[]) => {
  const { jsPDF, autoTable } = await loadExportLibs();
  const doc = new jsPDF('landscape');
  await setupPdfFont(doc);

  const PAGE_WIDTH = doc.internal.pageSize.getWidth();
  doc.setFontSize(18);
  doc.text("DANH SÁCH ĐƠN HÀNG", PAGE_WIDTH / 2, 20, { align: "center" });

  doc.setFontSize(10);
  doc.text(`Ngày xuất: ${new Date().toLocaleString("vi-VN")}`, 14, 28);

  const tableColumn = ["#", "Mã ĐH", "Khách hàng", "SĐT", "Địa chỉ", "Tiền hàng", "Thanh toán", "Trạng thái", "Ngày đặt"];
  const tableRows = data.map((item, index) => [
      index + 1,
      item.code,
      item.customer_name,
      item.customer_phone,
      item.shipping_address.substring(0, 50) + (item.shipping_address.length > 50 ? "..." : ""),
      item.total_amount.toLocaleString("vi-VN"),
      `${item.payment_method}`,
      item.current_status,
      new Date(item.createdAt).toLocaleDateString("vi-VN")
  ]);

  autoTable(doc, {
    startY: 35,
    head: [tableColumn],
    body: tableRows,
    ...getPdfTableStyles(doc),
  });

  doc.save(`Danh-sach-Don-Hang-${new Date().getTime()}.pdf`);
};
