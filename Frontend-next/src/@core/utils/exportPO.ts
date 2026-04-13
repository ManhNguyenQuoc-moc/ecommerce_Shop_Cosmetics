import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('vi-VN').format(val) + " VND";
};

// Hàm loại bỏ dấu tiếng Việt (Vì jsPDF mặc định không hỗ trợ Unicode trừ khi bạn nạp font .ttf)
const removeVietnameseTones = (str: string) => {
  if (!str) return '';
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); 
  str = str.replace(/\u02C6|\u0306|\u031B/g, "");
  return str;
};

const COMPANY_LOGO_BASE64 = "data:image/png;base64,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";

export const exportPOTopdf = (po: any, includeReceipt: boolean = false) => {
  const doc = new jsPDF();
  const PAGE_WIDTH = doc.internal.pageSize.getWidth();
  const MARGIN = 14;

  // --- 1. HEADER SECTION ---
  try {
    doc.addImage(COMPANY_LOGO_BASE64, 'PNG', MARGIN, 10, 40, 40);
  } catch (e) {
    console.error("Error adding image to doc", e);
  }

  // Company Details
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(31, 41, 55);
  doc.text("SHOP COSMETICS VN", PAGE_WIDTH - MARGIN, 20, { align: "right" });
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(75, 85, 99);
  doc.text("Professional Cosmetology & Supply", PAGE_WIDTH - MARGIN, 25, { align: "right" });
  doc.text("123 Le Loi Street, Dist 1, HCMC", PAGE_WIDTH - MARGIN, 30, { align: "right" });
  doc.text("Phone: (+84) 909 123 456 | Email: partner@cosmetrics.vn", PAGE_WIDTH - MARGIN, 35, { align: "right" });
  doc.text("Tax ID: 0123456789", PAGE_WIDTH - MARGIN, 40, { align: "right" });

  doc.setDrawColor(209, 213, 219);
  doc.line(MARGIN, 52, PAGE_WIDTH - MARGIN, 52);

  // --- 2. DOCUMENT TITLE & INFO ---
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(236, 72, 153); // Brand Pink
  // Song ngữ chuyên nghiệp
  doc.text(includeReceipt ? removeVietnameseTones("PHIEU NHAP KHO / STOCK RECEIPT") : removeVietnameseTones("PHIEU DAT HANG / PURCHASE ORDER"), MARGIN, 68);

  doc.setFontSize(10);
  doc.setTextColor(31, 41, 55);
  doc.text(`PO No:`, MARGIN, 78);
  doc.setFont("helvetica", "bold");
  doc.text(`${po.code}`, MARGIN + 22, 78);

  doc.setFont("helvetica", "normal");
  doc.text(`Date:`, MARGIN, 84);
  doc.text(`${po.createdAt ? new Date(po.createdAt).toLocaleDateString("vi-VN") : new Date().toLocaleDateString("vi-VN")}`, MARGIN + 22, 84);

  doc.text(`Status:`, MARGIN, 90);
  const statusColor = po.status === 'COMPLETED' ? [16, 185, 129] : (po.status === 'CANCELLED' ? [239, 68, 68] : [236, 72, 153]);
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.setFont("helvetica", "bold");
  doc.text(`${po.status}`, MARGIN + 22, 90);

  // --- 3. SUPPLIER & SHIPPING ---
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(removeVietnameseTones("NHA CUNG CAP / SUPPLIER:"), MARGIN, 105);
  doc.text(removeVietnameseTones("GIAO HANG TOI / SHIP TO:"), (PAGE_WIDTH / 2) + 5, 105);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  
  // Supplier Info
  doc.text(removeVietnameseTones(po.brand?.name || "N/A"), MARGIN, 111);
  doc.text(`Email: ${po.brand?.email || "N/A"}`, MARGIN, 117);
  doc.text(`Phone: ${po.brand?.phone || "N/A"}`, MARGIN, 123);

  // Ship To 
  const shipX = (PAGE_WIDTH / 2) + 5;
  doc.text("Shop Cosmetics VN - Main Warehouse", shipX, 111);
  doc.text("123 Le Loi Street, District 1", shipX, 117);
  doc.text("Ho Chi Minh City, Vietnam", shipX, 123);

  // --- 4. ITEM TABLE ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(17, 24, 39);
  doc.text(removeVietnameseTones("1. CHI TIET DAT HANG / ORDERED ITEMS"), MARGIN, 138);

  // Tách cột rõ ràng: Product, Variant, SKU
  const tableColumn = ["#", "Product", "Variant", "SKU", "Qty", "Unit Price", "Total (VND)"];
  const tableRows: any[] = [];
  
  po.items?.forEach((item: any, index: number) => {
    const variantName = [item.variant?.color, item.variant?.size].filter(Boolean).join(" - ");
    const productName = item.variant?.product?.name || "Unknown Product";
    const sku = item.variant?.sku || "-";
    
    tableRows.push([
      index + 1,
      removeVietnameseTones(productName),
      removeVietnameseTones(variantName || "Standard"),
      sku,
      item.orderedQty,
      formatCurrency(item.costPrice).replace(" VND", ""), // Rút gọn VND vào header
      formatCurrency(item.orderedQty * item.costPrice).replace(" VND", "")
    ]);
  });

  autoTable(doc, {
    startY: 142,
    head: [tableColumn],
    body: tableRows,
    theme: 'grid', // Đổi sang Grid cho tài liệu B2B chuyên nghiệp hơn
    headStyles: { fillColor: [236, 72, 153], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center' },
    styles: { font: "helvetica", fontSize: 8, cellPadding: 3, textColor: [55, 65, 81] },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 35 },
      3: { cellWidth: 25 },
      4: { cellWidth: 15, halign: 'center' },
      5: { cellWidth: 25, halign: 'right' },
      6: { cellWidth: 30, halign: 'right' },
    }
  });

  let currentY = (doc as any).lastAutoTable?.finalY + 12;

  // --- 5. RECEIPT SECTION (Optional) ---
  if (includeReceipt && po.receipts && po.receipts.length > 0) {
    if (currentY > 240) { doc.addPage(); currentY = 20; }
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(removeVietnameseTones("2. CHI TIET NHAP KHO / RECEIPT LOGS"), MARGIN, currentY);

    const receivedColumn = ["#", "Product", "Variant", "SKU", "Recv Qty", "Batch No", "Exp Date"];
    const receivedRows: any[] = [];
    
    po.receipts.forEach((receipt: any, index: number) => {
      const poItem = po.items?.find((i: any) => i.variantId === receipt.variantId);
      const productName = poItem?.variant?.product?.name || "Unknown Product";
      const variantName = [poItem?.variant?.color, poItem?.variant?.size].filter(Boolean).join(" - ");
      const sku = poItem?.variant?.sku || "-";
      
      receivedRows.push([
        index + 1,
        removeVietnameseTones(productName),
        removeVietnameseTones(variantName || "Standard"),
        sku,
        receipt.quantity,
        receipt.batchNumber || "-",
        receipt.expiryDate ? new Date(receipt.expiryDate).toLocaleDateString("vi-VN") : "N/A"
      ]);
    });

    autoTable(doc, {
      startY: currentY + 4,
      head: [receivedColumn],
      body: receivedRows,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center' }, // Màu xanh lá cho Receipt
      styles: { font: "helvetica", fontSize: 8, cellPadding: 3, textColor: [55, 65, 81] },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 30 },
        3: { cellWidth: 25 },
        4: { cellWidth: 20, halign: 'center' },
        5: { cellWidth: 25, halign: 'center' },
        6: { cellWidth: 22, halign: 'center' },
      }
    });

    currentY = (doc as any).lastAutoTable?.finalY + 12;
  }

  // --- 6. FOOTER & TOTALS ---
  if (currentY > 240) { doc.addPage(); currentY = 20; }

  const totalBoxX = PAGE_WIDTH - MARGIN - 80;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Subtotal:", totalBoxX, currentY);
  doc.text(formatCurrency(po.totalAmount), PAGE_WIDTH - MARGIN, currentY, { align: "right" });
  
  doc.text("Tax (0%):", totalBoxX, currentY + 6);
  doc.text(formatCurrency(0), PAGE_WIDTH - MARGIN, currentY + 6, { align: "right" });

  doc.setDrawColor(209, 213, 219);
  doc.line(totalBoxX, currentY + 10, PAGE_WIDTH - MARGIN, currentY + 10);

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("GRAND TOTAL:", totalBoxX, currentY + 18);
  doc.setTextColor(236, 72, 153);
  doc.text(formatCurrency(po.totalAmount), PAGE_WIDTH - MARGIN, currentY + 18, { align: "right" });

  // Note Section
  if (po.note) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(31, 41, 55);
    doc.text(removeVietnameseTones("GHI CHU / NOTES:"), MARGIN, currentY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(75, 85, 99);
    const splitNote = doc.splitTextToSize(removeVietnameseTones(po.note), 100);
    doc.text(splitNote, MARGIN, currentY + 6);
  }

  // Approval Signatures Area
  currentY = currentY + 35;
  if (currentY > 260) { doc.addPage(); currentY = 30; }
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(31, 41, 55);
  doc.text(removeVietnameseTones("Dai dien Ben A / Buyer"), MARGIN + 10, currentY, { align: "center" });
  doc.text(removeVietnameseTones("Dai dien Ben B / Supplier"), PAGE_WIDTH - MARGIN - 20, currentY, { align: "center" });
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(156, 163, 175);
  doc.text("(Sign & Stamp)", MARGIN + 10, currentY + 5, { align: "center" });
  doc.text("(Sign & Stamp)", PAGE_WIDTH - MARGIN - 20, currentY + 5, { align: "center" });

  // Page Numbers
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text(`Page ${i} of ${pageCount}`, PAGE_WIDTH / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });
    doc.text("Shop Cosmetics VN - Procurement Dept", MARGIN, doc.internal.pageSize.getHeight() - 10);
  }

  doc.save(`${includeReceipt ? "Receipt" : "PO"}-${po.code}.pdf`);
};

export const exportPOToExcel = (po: any, includeReceipt: boolean = false) => {
  // Cấu trúc File Excel chuyên nghiệp hơn
  const wsData = [
    [includeReceipt ? "STOCK RECEIPT (PO + ACTUAL RECEIPT)" : "PURCHASE ORDER (PHIẾU ĐẶT HÀNG)"],
    [],
    ["PO Number:", po.code, "", "Supplier:", po.brand?.name],
    ["Date:", po.createdAt ? new Date(po.createdAt).toLocaleDateString("vi-VN") : new Date().toLocaleDateString("vi-VN"), "", "Email:", po.brand?.email],
    ["Status:", po.status, "", "Phone:", po.brand?.phone],
    [],
    ["1. ORDER INFORMATION (CHI TIẾT ĐẶT HÀNG)"],
    ["#", "Product Name", "Variant", "SKU", "Qty Ordered", "Unit Price (VND)", "Total Amount (VND)"]
  ];

  po.items?.forEach((item: any, index: number) => {
    const variantName = [item.variant?.color, item.variant?.size].filter(Boolean).join(" - ");
    const sku = item.variant?.sku || "-";
    
    wsData.push([
      index + 1,
      item.variant?.product?.name || "Unknown",
      variantName || "Standard",
      sku,
      item.orderedQty,
      item.costPrice,
      item.orderedQty * item.costPrice
    ]);
  });

  if (includeReceipt && po.receipts && po.receipts.length > 0) {
    wsData.push([], [], ["2. ACTUAL RECEIPT INFORMATION (CHI TIẾT NHẬP KHO)"]);
    wsData.push(["#", "Product Name", "Variant", "SKU", "Qty Received", "Batch Number", "Expiry Date"]);
    
    po.receipts.forEach((receipt: any, index: number) => {
      const poItem = po.items?.find((i: any) => i.variantId === receipt.variantId);
      const variantName = [poItem?.variant?.color, poItem?.variant?.size].filter(Boolean).join(" - ");
      const sku = poItem?.variant?.sku || "-";

      wsData.push([
        index + 1,
        poItem?.variant?.product?.name || "Unknown",
        variantName || "Standard",
        sku,
        receipt.quantity,
        receipt.batchNumber,
        receipt.expiryDate ? new Date(receipt.expiryDate).toLocaleDateString("vi-VN") : "N/A"
      ]);
    });
  } else if (includeReceipt) {
    wsData.push([], ["2. ACTUAL RECEIPT INFORMATION"], ["No receipt data available yet."]);
  }

  wsData.push([], ["", "", "", "", "", "GRAND TOTAL (VND):", po.totalAmount]);
  if (po.note) {
    wsData.push(["", "", "", "", "", "NOTES:", po.note]);
  }

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  
  // Set chiều rộng cột cho Excel
  ws['!cols'] = [
    { wch: 5 },   // STT
    { wch: 40 },  // Product
    { wch: 25 },  // Variant
    { wch: 20 },  // SKU
    { wch: 15 },  // Qty
    { wch: 20 },  // Price/Batch
    { wch: 20 }   // Total/Exp
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Purchase Order");
  XLSX.writeFile(wb, `${includeReceipt ? "Receipt" : "PO"}-${po.code}.xlsx`);
};