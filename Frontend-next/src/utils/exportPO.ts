import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

// Helper to remove some heavy tones if font fails, but we'll try raw first
const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('vi-VN').format(val) + " VND";
};

// jsPDF default helvetica font doesn't support complex UTF-8 Vietnamese chars
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

export const exportPOTopdf = (po: any) => {
  const doc = new jsPDF();
  
  // Generic sans-serif font
  doc.setFont("helvetica");

  doc.setFontSize(22);
  doc.setTextColor(245, 158, 11); // Amber
  doc.text("PURCHASE ORDER", 14, 22);
  
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0); // Black
  doc.text(`PO Number: ${po.code}`, 14, 32);
  doc.text(`Date: ${po.createdAt ? new Date(po.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}`, 14, 38);
  doc.text(`Status: ${po.status}`, 14, 44);

  // Supplier info
  doc.setFont("helvetica", "bold");
  doc.text("SUPPLIER:", 14, 54);
  doc.setFont("helvetica", "normal");
  doc.text(removeVietnameseTones(po.supplier?.name || "Unknown"), 14, 60);
  doc.text(`Email: ${po.supplier?.email || "N/A"}`, 14, 66);
  doc.text(`Phone: ${po.supplier?.phone || "N/A"}`, 14, 72);

  const startX = 140;
  doc.setFont("helvetica", "bold");
  doc.text("SHIP TO:", startX, 54);
  doc.setFont("helvetica", "normal");
  doc.text("Shop Cosmetics VN", startX, 60);
  doc.text("123 Le Loi Street, D1, HCMC", startX, 66);
  doc.text("Phone: 0909 123 456", startX, 72);

  const tableColumn = ["#", "Product", "Variant", "Qty", "Unit Price", "Total"];
  const tableRows: any[] = [];
  
  po.items?.forEach((item: any, index: number) => {
    // Basic fallback to avoid undefined
    const variantName = [item.variant?.color, item.variant?.size].filter(Boolean).join(" - ");
    const totalPrice = item.orderedQty * item.costPrice;
    
    // Remove vietnamese characters so jsPDF doesn't corrupt it
    tableRows.push([
      index + 1,
      removeVietnameseTones(item.variant?.product?.name || "Unknown Product"),
      removeVietnameseTones(variantName || "Standard"),
      item.orderedQty,
      formatCurrency(item.costPrice),
      formatCurrency(totalPrice)
    ]);
  });

  autoTable(doc, {
    startY: 85,
    head: [tableColumn],
    body: tableRows,
    theme: 'striped',
    headStyles: { fillColor: [245, 158, 11] }, // Amber 500
    styles: { font: "helvetica" }
  });

  const finalY = (doc as any).lastAutoTable?.finalY || 85;
  doc.setFont("helvetica", "bold");
  doc.text(`Total Amount: ${formatCurrency(po.totalAmount)}`, 14, finalY + 15);
  doc.setFont("helvetica", "normal");
  if (po.note) {
    doc.text(`Note: ${removeVietnameseTones(po.note)}`, 14, finalY + 25);
  }

  doc.save(`${po.code}.pdf`);
};

export const exportPOToExcel = (po: any) => {
  const wsData = [
    ["PURCHASE ORDER"],
    [`PO Number: ${po.code}`],
    [`Date: ${po.createdAt ? new Date(po.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}`],
    [`Status: ${po.status}`],
    [],
    ["SUPPLIER INFO", "", "SHIP TO"],
    [po.supplier?.name, "", "Shop Cosmetics VN"],
    [`Email: ${po.supplier?.email}`, "", "123 Le Loi Street, D1, HCMC"],
    [`Phone: ${po.supplier?.phone}`, "", "Phone: 0909 123 456"],
    [],
    ["ITEMS LIST"],
    ["#", "Product Name", "Variant", "Qty", "Unit Price (VND)", "Total (VND)"]
  ];

  po.items?.forEach((item: any, index: number) => {
    const variantName = [item.variant?.color, item.variant?.size].filter(Boolean).join(" - ");
    const totalPrice = item.orderedQty * item.costPrice;
    wsData.push([
      index + 1,
      item.variant?.product?.name || "Unknown",
      variantName || "Standard",
      item.orderedQty,
      item.costPrice,
      totalPrice
    ]);
  });

  wsData.push([]);
  wsData.push(["", "", "", "", "TOTAL AMOUNT:", po.totalAmount]);
  if (po.note) {
    wsData.push(["", "", "", "", "NOTE:", po.note]);
  }

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  
  // Set nice column widths for Excel
  ws['!cols'] = [
    { wch: 5 },  // #
    { wch: 40 }, // Product Name
    { wch: 20 }, // Variant
    { wch: 10 }, // Qty
    { wch: 20 }, // Unit Price
    { wch: 20 }, // Total
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Purchase Order");
  XLSX.writeFile(wb, `${po.code}.xlsx`);
};
