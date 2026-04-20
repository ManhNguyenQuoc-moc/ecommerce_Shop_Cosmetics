import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { DashboardResponseDTO } from "@/src/services/admin/dashboard/models/output.model";

type DashboardMode = "simple" | "advanced";

type ExportOptions = {
  timeFilter?: string;
  startDate?: string;
  endDate?: string;
  includeCharts?: boolean;
};

const formatCurrency = (value: number) => new Intl.NumberFormat("vi-VN").format(value) + " VND";
const formatNumber = (value: number) => new Intl.NumberFormat("vi-VN").format(value);

const removeVietnameseTones = (str: string) => {
  if (!str) return "";
  return str
    .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
    .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
    .replace(/ì|í|ị|ỉ|ĩ/g, "i")
    .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
    .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
    .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
    .replace(/đ/g, "d")
    .replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A")
    .replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E")
    .replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I")
    .replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O")
    .replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U")
    .replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y")
    .replace(/Đ/g, "D")
    .replace(/[\u0300\u0301\u0303\u0309\u0323]/g, "")
    .replace(/[\u02C6\u0306\u031B]/g, "");
};

const buildMetricsRows = (data: DashboardResponseDTO) => [
  ["Tong don hang", formatNumber(data.metrics.totalOrders.value), `${data.metrics.totalOrders.trend}%`],
  ["Tong doanh thu", formatCurrency(data.metrics.totalRevenue.value), `${data.metrics.totalRevenue.trend}%`],
  ["Loi nhuan", formatCurrency(data.metrics.netProfit.value), `${data.metrics.netProfit.trend}%`],
  ["Tong khach hang", formatNumber(data.metrics.totalUsers.value), `${data.metrics.totalUsers.trend}%`],
  ["Khach moi", data.metrics.monthlyNewUsers.formattedValue || formatNumber(data.metrics.monthlyNewUsers.value), `${data.metrics.monthlyNewUsers.trend}%`],
];

const ensureSpace = (doc: jsPDF, y: number, heightNeeded: number) => {
  if (y + heightNeeded > 280) {
    doc.addPage();
    return 18;
  }
  return y;
};

type ChartItem = { label: string; value: number };

const drawBarChartSection = (
  doc: jsPDF,
  title: string,
  items: ChartItem[],
  color: [number, number, number],
  yStart: number
) => {
  let y = ensureSpace(doc, yStart, items.length * 10 + 24);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(removeVietnameseTones(title), 14, y);
  y += 8;

  const maxValue = Math.max(...items.map((i) => i.value), 1);
  const barX = 88;
  const barMaxWidth = 82;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  items.forEach((item) => {
    const rowY = y;
    const barWidth = Math.max(1, (item.value / maxValue) * barMaxWidth);
    const label = removeVietnameseTones(item.label).slice(0, 28);

    doc.setTextColor(55, 65, 81);
    doc.text(label, 14, rowY);

    doc.setFillColor(color[0], color[1], color[2]);
    doc.rect(barX, rowY - 4, barWidth, 5, "F");

    doc.setTextColor(75, 85, 99);
    doc.text(formatNumber(item.value), barX + barMaxWidth + 6, rowY);
    y += 10;
  });

  doc.setTextColor(0, 0, 0);
  return y + 2;
};

const addTitleBlock = (doc: jsPDF, title: string, subtitle: string) => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(removeVietnameseTones(title), 14, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  doc.text(removeVietnameseTones(subtitle), 14, 25);
  doc.setTextColor(0, 0, 0);
};

export const exportDashboardToPdf = (
  data: DashboardResponseDTO,
  mode: DashboardMode,
  options?: ExportOptions
) => {
  const doc = new jsPDF();
  const generatedAt = new Date().toLocaleString("vi-VN");
  const subtitleParts = [
    `Generated: ${generatedAt}`,
    options?.timeFilter ? `Filter: ${options.timeFilter}` : "",
    options?.startDate ? `From: ${options.startDate}` : "",
    options?.endDate ? `To: ${options.endDate}` : "",
  ].filter(Boolean);

  addTitleBlock(
    doc,
    mode === "simple" ? "BAO CAO TONG QUAN KINH DOANH" : "BAO CAO PHAN TICH CHI TIET",
    subtitleParts.join(" | ")
  );

  autoTable(doc, {
    startY: 32,
    head: [["Chi so", "Gia tri", "Xu huong"]],
    body: buildMetricsRows(data),
    headStyles: { fillColor: [99, 102, 241] },
    styles: { font: "helvetica", fontSize: 10 },
  });

  let y = (doc as any).lastAutoTable.finalY + 8;

  const topProductsRows = data.bestSellingProducts.slice(0, 10).map((item, index) => [
    index + 1,
    removeVietnameseTones(item.name),
    formatNumber(item.sales),
  ]);

  autoTable(doc, {
    startY: y,
    head: [["Top products", "Ten", "So luong ban"]],
    body: topProductsRows,
    headStyles: { fillColor: [6, 182, 212] },
    styles: { font: "helvetica", fontSize: 9 },
    columnStyles: { 0: { halign: "center", cellWidth: 24 } },
  });

  y = (doc as any).lastAutoTable.finalY + 8;

  if (mode === "simple") {
    const topVariantsRows = data.bestSellingVariants.slice(0, 10).map((item, index) => [
      index + 1,
      removeVietnameseTones(item.name),
      formatNumber(item.sales),
    ]);

    autoTable(doc, {
      startY: y,
      head: [["Top variants", "Ten", "So luong ban"]],
      body: topVariantsRows,
      headStyles: { fillColor: [16, 185, 129] },
      styles: { font: "helvetica", fontSize: 9 },
      columnStyles: { 0: { halign: "center", cellWidth: 24 } },
    });

    y = (doc as any).lastAutoTable.finalY + 8;

    const marketShareRows = data.brandAnalytics.marketShare.slice(0, 10).map((item, index) => [
      index + 1,
      removeVietnameseTones(item.name),
      formatNumber(item.value),
    ]);

    autoTable(doc, {
      startY: y,
      head: [["Thi phan thuong hieu", "Thuong hieu", "Gia tri"]],
      body: marketShareRows,
      headStyles: { fillColor: [245, 158, 11] },
      styles: { font: "helvetica", fontSize: 9 },
      columnStyles: { 0: { halign: "center", cellWidth: 24 } },
    });

    y = (doc as any).lastAutoTable.finalY + 8;

    if (options?.includeCharts !== false) {
      y = drawBarChartSection(
        doc,
        "BIEU DO TOP SAN PHAM",
        data.bestSellingProducts.slice(0, 5).map((item) => ({ label: item.name, value: item.sales })),
        [6, 182, 212],
        y
      );
    }
  } else {
    const statusRows = data.orderManagement.statusDistribution.map((item, index) => [
      index + 1,
      removeVietnameseTones(item.status),
      formatNumber(item.count),
    ]);

    autoTable(doc, {
      startY: y,
      head: [["Trang thai don hang", "Trang thai", "So luong"]],
      body: statusRows,
      headStyles: { fillColor: [239, 68, 68] },
      styles: { font: "helvetica", fontSize: 9 },
      columnStyles: { 0: { halign: "center", cellWidth: 24 } },
    });

    y = (doc as any).lastAutoTable.finalY + 8;

    const spendingRows = data.purchaseAnalytics.spendingByBrand.slice(0, 10).map((item, index) => [
      index + 1,
      removeVietnameseTones(item.name),
      formatCurrency(item.value),
    ]);

    autoTable(doc, {
      startY: y,
      head: [["Chi phi nhap theo thuong hieu", "Thuong hieu", "Tong chi phi"]],
      body: spendingRows,
      headStyles: { fillColor: [168, 85, 247] },
      styles: { font: "helvetica", fontSize: 9 },
      columnStyles: { 0: { halign: "center", cellWidth: 24 } },
    });

    y = (doc as any).lastAutoTable.finalY + 8;

    if (options?.includeCharts !== false) {
      y = drawBarChartSection(
        doc,
        "BIEU DO TRANG THAI DON HANG",
        data.orderManagement.statusDistribution.slice(0, 5).map((item) => ({ label: item.status, value: item.count })),
        [239, 68, 68],
        y
      );

      y = drawBarChartSection(
        doc,
        "BIEU DO CHI PHI NHAP THEO THUONG HIEU",
        data.purchaseAnalytics.spendingByBrand.slice(0, 5).map((item) => ({ label: item.name, value: item.value })),
        [168, 85, 247],
        y
      );
    }
  }

  const fileName = `${mode === "simple" ? "Dashboard-Summary" : "Dashboard-Advanced"}-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
};

export const exportDashboardToExcel = (
  data: DashboardResponseDTO,
  mode: DashboardMode,
  options?: ExportOptions
) => {
  const wb = XLSX.utils.book_new();

  const metricsSheet = XLSX.utils.json_to_sheet(
    buildMetricsRows(data).map((row) => ({
      Metric: row[0],
      Value: row[1],
      Trend: row[2],
      TimeFilter: options?.timeFilter || "N/A",
      StartDate: options?.startDate || "N/A",
      EndDate: options?.endDate || "N/A",
    }))
  );

  const topProductsSheet = XLSX.utils.json_to_sheet(
    data.bestSellingProducts.map((item, index) => ({
      Rank: index + 1,
      Product: item.name,
      Sales: item.sales,
    }))
  );

  const topVariantsSheet = XLSX.utils.json_to_sheet(
    data.bestSellingVariants.map((item, index) => ({
      Rank: index + 1,
      Variant: item.name,
      Sales: item.sales,
    }))
  );

  const marketShareSheet = XLSX.utils.json_to_sheet(
    data.brandAnalytics.marketShare.map((item, index) => ({
      Rank: index + 1,
      Brand: item.name,
      Value: item.value,
    }))
  );

  XLSX.utils.book_append_sheet(wb, metricsSheet, "Metrics");
  XLSX.utils.book_append_sheet(wb, topProductsSheet, "TopProducts");

  if (mode === "simple") {
    XLSX.utils.book_append_sheet(wb, topVariantsSheet, "TopVariants");
    XLSX.utils.book_append_sheet(wb, marketShareSheet, "BrandShare");
  } else {
    const orderStatusSheet = XLSX.utils.json_to_sheet(
      data.orderManagement.statusDistribution.map((item, index) => ({
        Rank: index + 1,
        Status: item.status,
        Count: item.count,
      }))
    );

    const spendingByBrandSheet = XLSX.utils.json_to_sheet(
      data.purchaseAnalytics.spendingByBrand.map((item, index) => ({
        Rank: index + 1,
        Brand: item.name,
        Spending: item.value,
      }))
    );

    XLSX.utils.book_append_sheet(wb, orderStatusSheet, "OrderStatus");
    XLSX.utils.book_append_sheet(wb, spendingByBrandSheet, "SpendingByBrand");
  }

  const fileName = `${mode === "simple" ? "Dashboard-Summary" : "Dashboard-Advanced"}-${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, fileName);
};
