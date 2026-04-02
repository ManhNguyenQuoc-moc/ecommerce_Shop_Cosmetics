import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('vi-VN').format(val) + " VND";
};

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

export const exportPOTopdf = (po: any, includeReceipt: boolean = false) => {
  const doc = new jsPDF();
  doc.setFont("helvetica");

  doc.setFontSize(22);
  doc.setTextColor(236, 72, 153); // Brand Pink
  doc.text(includeReceipt ? "STOCK RECEIPT (PO + RECEIPT)" : "PURCHASE ORDER", 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`PO Number: ${po.code}`, 14, 30);
  doc.text(`Date: ${po.createdAt ? new Date(po.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}`, 14, 36);
  doc.text(`Status: ${po.status}`, 14, 42);

  // Supplier & Ship Info
  doc.setFont("helvetica", "bold");
  doc.text("SUPPLIER:", 14, 52);
  doc.setFont("helvetica", "normal");
  doc.text(removeVietnameseTones(po.brand?.name || "Unknown"), 14, 58);
  doc.text(`Email: ${po.brand?.email || "N/A"}`, 14, 64);
  doc.text(`Phone: ${po.brand?.phone || "N/A"}`, 14, 70);

  const startX = 140;
  doc.setFont("helvetica", "bold");
  doc.text("SHIP TO:", startX, 52);
  doc.setFont("helvetica", "normal");
  doc.text("Shop Cosmetics VN", startX, 58);
  doc.text("123 Le Loi Street, D1, HCMC", startX, 64);
  doc.text("Phone: 0909 123 456", startX, 70);

  // SECTION 1: Ordered Items
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("1. ORDER INFORMATION", 14, 82);

  const tableColumn = ["#", "Product", "Variant", "Qty Order", "Unit Price", "Total"];
  const tableRows: any[] = [];
  po.items?.forEach((item: any, index: number) => {
    const variantName = [item.variant?.color, item.variant?.size].filter(Boolean).join(" - ");
    tableRows.push([
      index + 1,
      removeVietnameseTones(item.variant?.product?.name || "Unknown Product"),
      removeVietnameseTones(variantName || "Standard"),
      item.orderedQty,
      formatCurrency(item.costPrice),
      formatCurrency(item.orderedQty * item.costPrice)
    ]);
  });

  autoTable(doc, {
    startY: 85,
    head: [tableColumn],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [236, 72, 153] },
    styles: { font: "helvetica", fontSize: 9 }
  });

  let currentY = (doc as any).lastAutoTable?.finalY + 10;

  // SECTION 2: Actual Receipt (only if includeReceipt is true)
  if (includeReceipt && po.receipts && po.receipts.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("2. ACTUAL RECEIPT", 14, currentY);

    const receivedColumn = ["#", "Product", "Variant", "Qty Received", "Batch Number", "Expiry Date"];
    const receivedRows: any[] = [];
    
    po.receipts.forEach((receipt: any, index: number) => {
      const poItem = po.items?.find((i: any) => i.variantId === receipt.variantId);
      const variantName = [poItem?.variant?.color, poItem?.variant?.size].filter(Boolean).join(" - ");
      
      receivedRows.push([
        index + 1,
        removeVietnameseTones(poItem?.variant?.product?.name || "Unknown Product"),
        removeVietnameseTones(variantName || "Standard"),
        receipt.quantity,
        receipt.batchNumber,
        receipt.expiryDate ? new Date(receipt.expiryDate).toLocaleDateString() : "N/A"
      ]);
    });

    autoTable(doc, {
      startY: currentY + 5,
      head: [receivedColumn],
      body: receivedRows,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] }, // Emerald
      styles: { font: "helvetica", fontSize: 9 }
    });

    currentY = (doc as any).lastAutoTable?.finalY + 10;
  } else if (includeReceipt) {
    // Handle case where includeReceipt is true but no receipts exist yet
    doc.setFont("helvetica", "italic");
    doc.text("No receipt data available yet.", 14, currentY);
    currentY += 10;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`TOTAL ORDER AMOUNT: ${formatCurrency(po.totalAmount)}`, 14, currentY);
  
  if (po.note) {
    doc.setFont("helvetica", "normal");
    doc.text(`Note: ${removeVietnameseTones(po.note)}`, 14, currentY + 7);
  }

  doc.save(`${includeReceipt ? "Receipt" : "PO"}-${po.code}.pdf`);
};

export const exportPOToExcel = (po: any, includeReceipt: boolean = false) => {
  const wsData = [
    [includeReceipt ? "STOCK RECEIPT (PO + RECEIPT)" : "PURCHASE ORDER"],
    [`PO Number: ${po.code}`],
    [`Date: ${po.createdAt ? new Date(po.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}`],
    [`Status: ${po.status}`],
    [],
    ["SUPPLIER INFO", "", "SHIP TO"],
    [po.brand?.name, "", "Shop Cosmetics VN"],
    [`Email: ${po.brand?.email}`, "", "123 Le Loi Street, D1, HCMC"],
    [`Phone: ${po.brand?.phone}`, "", "Phone: 0909 123 456"],
    [],
    ["1. ORDER INFORMATION"],
    ["#", "Product Name", "Variant", "Qty Ordered", "Unit Price (VND)", "Total (VND)"]
  ];

  po.items?.forEach((item: any, index: number) => {
    const variantName = [item.variant?.color, item.variant?.size].filter(Boolean).join(" - ");
    wsData.push([
      index + 1,
      item.variant?.product?.name || "Unknown",
      variantName || "Standard",
      item.orderedQty,
      item.costPrice,
      item.orderedQty * item.costPrice
    ]);
  });

  if (includeReceipt && po.receipts && po.receipts.length > 0) {
    wsData.push([], ["2. ACTUAL RECEIPT INFORMATION"]);
    wsData.push(["#", "Product Name", "Variant", "Qty Received", "Batch Number", "Expiry Date"]);
    po.receipts.forEach((receipt: any, index: number) => {
      const poItem = po.items?.find((i: any) => i.variantId === receipt.variantId);
      const variantName = [poItem?.variant?.color, poItem?.variant?.size].filter(Boolean).join(" - ");
      wsData.push([
        index + 1,
        poItem?.variant?.product?.name || "Unknown",
        variantName || "Standard",
        receipt.quantity,
        receipt.batchNumber,
        receipt.expiryDate ? new Date(receipt.expiryDate).toLocaleDateString() : "N/A"
      ]);
    });
  } else if (includeReceipt) {
    wsData.push([], ["2. ACTUAL RECEIPT INFORMATION"], ["No receipt data available yet."]);
  }

  wsData.push([], ["", "", "", "TOTAL ORDER AMOUNT:", po.totalAmount]);
  if (po.note) {
    wsData.push(["", "", "", "NOTE:", po.note]);
  }

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  ws['!cols'] = [{ wch: 5 }, { wch: 40 }, { wch: 20 }, { wch: 15 }, { wch: 20 }, { wch: 20 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Purchase Order");
  XLSX.writeFile(wb, `${includeReceipt ? "Receipt" : "PO"}-${po.code}.xlsx`);
};
