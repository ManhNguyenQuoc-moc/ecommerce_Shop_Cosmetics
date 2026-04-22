import { OrderDto } from "@/src/services/models/order/output.dto";
import { loadExportLibs, setupPdfFont, getPdfTableStyles } from "./exportGeneral";

/**
 * Xuất hóa đơn chi tiết đơn hàng ra file PDF
 * Hỗ trợ Unicode Tiếng Việt, thiết kế chuyên nghiệp
 */
export const exportOrderInvoicePDF = async (order: OrderDto) => {
  const { jsPDF, autoTable } = await loadExportLibs();
  const doc = new jsPDF();
  await setupPdfFont(doc);

  const formatVND = (v: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v || 0);

  // --- HEADER SECTION ---
  const PAGE_WIDTH = doc.internal.pageSize.getWidth();
  
  // Brand Header
  doc.setFillColor(31, 41, 55); // Dark Slate
  doc.rect(0, 0, PAGE_WIDTH, 40, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFont("Roboto", "bold");
  doc.setFontSize(24);
  doc.text("MOC COSMETIC STORE", 15, 25);
  
  doc.setFontSize(10);
  doc.setFont("Roboto", "normal");
  doc.text("LAVISH • PREMIUM • ORGANIC", 15, 32);
  
  doc.setFontSize(20);
  doc.setFont("Roboto", "bold");
  doc.text("HÓA ĐƠN", PAGE_WIDTH - 65, 25);
  
  doc.setFontSize(10);
  doc.setFont("Roboto", "normal");
  doc.text(`#${order.code}`, PAGE_WIDTH - 65, 32);

  // --- INFO SECTION ---
  doc.setTextColor(0, 0, 0);
  let y = 55;
  
  // Store info (Left)
  doc.setFont("Roboto", "bold");
  doc.setFontSize(11);
  doc.text("CỬA HÀNG MOC COSMETIC", 15, y);
  doc.setFont("Roboto", "normal");
  doc.setFontSize(9);
  doc.text("Địa chỉ: 123 Đường Mỹ Phẩm, Quận 1, TP. HCM", 15, y + 6);
  doc.text("Hotline: 0123 456 789", 15, y + 11);
  doc.text("Email: support@moccosmetic.com", 15, y + 16);

  // Customer info (Right)
  const rightColX = PAGE_WIDTH / 2 + 10;
  doc.setFont("Roboto", "bold");
  doc.setFontSize(11);
  doc.text("KHÁCH HÀNG", rightColX, y);
  doc.setFont("Roboto", "normal");
  doc.setFontSize(9);
  doc.text(`Tên: ${order.customer_name}`, rightColX, y + 6);
  doc.text(`SĐT: ${order.customer_phone}`, rightColX, y + 11);
  doc.text(`Email: ${order.customer_email}`, rightColX, y + 16);
  
  // Shipping Address
  y += 25;
  doc.setFont("Roboto", "bold");
  doc.text("ĐỊA CHỈ NHẬN HÀNG:", 15, y);
  doc.setFont("Roboto", "normal");
  const splitAddress = doc.splitTextToSize(order.shipping_address, PAGE_WIDTH - 30);
  doc.text(splitAddress, 15, y + 6);
  
  y += (splitAddress.length * 5) + 5;

  // Invoice Meta
  doc.setFillColor(243, 244, 246);
  doc.rect(15, y, PAGE_WIDTH - 30, 10, "F");
  doc.setFont("Roboto", "bold");
  doc.text(`Ngày đặt hàng: ${new Date(order.createdAt).toLocaleDateString("vi-VN")}`, 20, y + 6.5);
  doc.text(`Phương thức TT: ${order.payment_method}`, PAGE_WIDTH / 2, y + 6.5);

  y += 18;

  // --- ITEMS TABLE ---
  const tableColumn = ["STT", "Mã SKU", "Sản phẩm", "Số lượng", "Đơn giá", "Thành tiền"];
  const tableRows = order.items.map((item, index) => [
    index + 1,
    item.variant?.sku || "N/A",
    `${item.variant?.product?.name}${item.variant?.color ? ` (${item.variant.color})` : ""}`,
    item.quantity,
    formatVND(item.price),
    formatVND(item.price * item.quantity)
  ]);

  autoTable(doc, {
    startY: y,
    head: [tableColumn],
    body: tableRows,
    ...getPdfTableStyles(doc),
    headStyles: {
      fillColor: [31, 41, 55],
      textColor: [255, 255, 255],
      fontStyle: 'normal'
    },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      3: { cellWidth: 20, halign: "center" },
      4: { cellWidth: 35, halign: "right" },
      5: { cellWidth: 35, halign: "right" }
    }
  });

  // --- SUMMARY SECTION ---
  y = (doc as any).lastAutoTable.finalY + 10;
  
  const summaryX = PAGE_WIDTH - 85;
  const summaryLabelX = summaryX;
  const summaryValueX = PAGE_WIDTH - 15;

  doc.setFontSize(10);
  
  // Subtotal
  doc.setFont("Roboto", "normal");
  doc.text("Tạm tính:", summaryLabelX, y);
  doc.text(formatVND(order.total_amount), summaryValueX, y, { align: "right" });
  
  // Discount
  if (order.discount_amount && order.discount_amount > 0) {
    y += 7;
    doc.text(`Giảm giá (${order.voucher_code || "Voucher"}):`, summaryLabelX, y);
    doc.setTextColor(220, 38, 38);
    doc.text(`-${formatVND(order.discount_amount)}`, summaryValueX, y, { align: "right" });
    doc.setTextColor(0, 0, 0);
  }
  
  // Shipping
  y += 7;
  doc.text("Phí vận chuyển:", summaryLabelX, y);
  doc.text(`+${formatVND(order.shipping_fee)}`, summaryValueX, y, { align: "right" });
  
  // Grand Total
  y += 10;
  doc.setLineWidth(0.5);
  doc.line(summaryLabelX, y - 5, summaryValueX, y - 5);
  
  doc.setFont("Roboto", "bold");
  doc.setFontSize(14);
  doc.setTextColor(79, 70, 229); // Indigo 600
  doc.text("TỔNG THANH TOÁN:", summaryLabelX, y + 2);
  doc.text(formatVND(order.final_amount), summaryValueX, y + 2, { align: "right" });

  // --- FOOTER SECTION ---
  y = doc.internal.pageSize.getHeight() - 30;
  doc.setTextColor(156, 163, 175);
  doc.setFont("Roboto", "normal");
  doc.setFontSize(9);
  doc.text("Cảm ơn quý khách đã tin tưởng và mua sắm tại MOC Cosmetic!", PAGE_WIDTH / 2, y, { align: "center" });
  doc.text("Hóa đơn này được tạo tự động bởi hệ thống.", PAGE_WIDTH / 2, y + 5, { align: "center" });

  doc.save(`Hoa-don-${order.code}.pdf`);
};
