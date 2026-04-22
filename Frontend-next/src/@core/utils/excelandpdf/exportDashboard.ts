import { DashboardResponseDTO } from "@/src/services/admin/dashboard/models/output.model";
import { loadExportLibs, setupPdfFont, getPdfTableStyles } from "./exportGeneral";

type DashboardMode = "simple" | "advanced";

type ExportOptions = {
  timeFilter?: string;
  startDate?: string;
  endDate?: string;
  includeCharts?: boolean;
};

const formatCurrency = (value: number) => new Intl.NumberFormat("vi-VN").format(value) + " VND";
const formatNumber = (value: number) => new Intl.NumberFormat("vi-VN").format(value);

const buildMetricsRows = (data: DashboardResponseDTO) => [
  ["Tổng đơn hàng", formatNumber(data.metrics.totalOrders.value), `${data.metrics.totalOrders.trend}%`],
  ["Tổng doanh thu", formatCurrency(data.metrics.totalRevenue.value), `${data.metrics.totalRevenue.trend}%`],
  ["Lợi nhuận", formatCurrency(data.metrics.netProfit.value), `${data.metrics.netProfit.trend}%`],
  ["Tổng khách hàng", formatNumber(data.metrics.totalUsers.value), `${data.metrics.totalUsers.trend}%`],
  ["Khách mới", data.metrics.monthlyNewUsers.formattedValue || formatNumber(data.metrics.monthlyNewUsers.value), `${data.metrics.monthlyNewUsers.trend}%`],
];

const ensureSpace = (doc: any, y: number, heightNeeded: number) => {
  if (y + heightNeeded > 280) {
    doc.addPage();
    return 18;
  }
  return y;
};

type ChartItem = { label: string; value: number };

const drawBarChartSection = (
  doc: any,
  title: string,
  items: ChartItem[],
  color: [number, number, number],
  yStart: number
) => {
  let y = ensureSpace(doc, yStart, items.length * 10 + 24);

  doc.setFont("Roboto", "bold");
  doc.setFontSize(11);
  doc.text(title, 14, y);
  y += 8;

  const maxValue = Math.max(...items.map((i) => i.value), 1);
  const barX = 88;
  const barMaxWidth = 82;

  doc.setFont("Roboto", "normal");
  doc.setFontSize(9);

  items.forEach((item) => {
    const rowY = y;
    const barWidth = Math.max(1, (item.value / maxValue) * barMaxWidth);
    const label = item.label.length > 28 ? item.label.slice(0, 25) + "..." : item.label;

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

const addTitleBlock = (doc: any, title: string, subtitle: string) => {
  doc.setFont("Roboto", "bold");
  doc.setFontSize(16);
  doc.text(title, 14, 18);

  doc.setFont("Roboto", "normal");
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  doc.text(subtitle, 14, 25);
  doc.setTextColor(0, 0, 0);
};

/**
 * Xuất báo cáo Dashboard ra file PDF
 * Hỗ trợ Unicode Tiếng Việt
 */
export const exportDashboardToPDF = async (
  data: DashboardResponseDTO,
  mode: DashboardMode,
  options?: ExportOptions
) => {
  const { jsPDF, autoTable } = await loadExportLibs();
  const doc = new jsPDF();
  await setupPdfFont(doc);

  const generatedAt = new Date().toLocaleString("vi-VN");
  const subtitleParts = [
    `Ngày xuất: ${generatedAt}`,
    options?.timeFilter ? `Lọc: ${options.timeFilter}` : "",
    options?.startDate ? `Từ: ${options.startDate}` : "",
    options?.endDate ? `Đến: ${options.endDate}` : "",
  ].filter(Boolean);

  addTitleBlock(
    doc,
    mode === "simple" ? "BÁO CÁO TỔNG QUAN KINH DOANH" : "BÁO CÁO PHÂN TÍCH CHI TIẾT",
    subtitleParts.join(" | ")
  );

  autoTable(doc, {
    startY: 32,
    head: [["Chỉ số", "Giá trị", "Xu hướng"]],
    body: buildMetricsRows(data),
    ...getPdfTableStyles(doc),
    headStyles: { 
      fontStyle: 'normal',
      fillColor: [99, 102, 241],
      textColor: [255, 255, 255]
    },
  });

  let y = (doc as any).lastAutoTable.finalY + 8;

  const topProductsRows = data.bestSellingProducts.slice(0, 10).map((item, index) => [
    index + 1,
    item.name,
    formatNumber(item.sales),
  ]);

  autoTable(doc, {
    startY: y,
    head: [["Top sản phẩm", "Tên sản phẩm", "Số lượng bán"]],
    body: topProductsRows,
    ...getPdfTableStyles(doc),
    headStyles: { 
      fontStyle: 'normal',
      fillColor: [6, 182, 212],
      textColor: [255, 255, 255]
    },
    columnStyles: { 0: { halign: "center", cellWidth: 24 } },
  });

  y = (doc as any).lastAutoTable.finalY + 8;

  if (mode === "simple") {
    const topVariantsRows = data.bestSellingVariants.slice(0, 10).map((item, index) => [
      index + 1,
      item.name,
      formatNumber(item.sales),
    ]);

    autoTable(doc, {
      startY: y,
      head: [["Top biến thể", "Tên biến thể", "Số lượng bán"]],
      body: topVariantsRows,
      ...getPdfTableStyles(doc),
      headStyles: { 
        fontStyle: 'normal',
        fillColor: [16, 185, 129],
        textColor: [255, 255, 255]
      },
      columnStyles: { 0: { halign: "center", cellWidth: 24 } },
    });

    y = (doc as any).lastAutoTable.finalY + 8;

    const marketShareRows = data.brandAnalytics.marketShare.slice(0, 10).map((item, index) => [
      index + 1,
      item.name,
      formatNumber(item.value),
    ]);

    autoTable(doc, {
      startY: y,
      head: [["Thị phần thương hiệu", "Thương hiệu", "Giá trị"]],
      body: marketShareRows,
      ...getPdfTableStyles(doc),
      headStyles: { 
        fontStyle: 'normal',
        fillColor: [245, 158, 11],
        textColor: [255, 255, 255]
      },
      columnStyles: { 0: { halign: "center", cellWidth: 24 } },
    });

    y = (doc as any).lastAutoTable.finalY + 8;

    if (options?.includeCharts !== false) {
      y = drawBarChartSection(
        doc,
        "BIỂU ĐỒ TOP SẢN PHẨM",
        data.bestSellingProducts.slice(0, 5).map((item) => ({ label: item.name, value: item.sales })),
        [6, 182, 212],
        y
      );
    }
  } else {
    const statusRows = data.orderManagement.statusDistribution.map((item, index) => [
      index + 1,
      item.status,
      formatNumber(item.count),
    ]);

    autoTable(doc, {
      startY: y,
      head: [["Trạng thái đơn hàng", "Trạng thái", "Số lượng"]],
      body: statusRows,
      ...getPdfTableStyles(doc),
      headStyles: { 
        fontStyle: 'normal',
        fillColor: [239, 68, 68],
        textColor: [255, 255, 255]
      },
      columnStyles: { 0: { halign: "center", cellWidth: 24 } },
    });

    y = (doc as any).lastAutoTable.finalY + 8;

    const spendingRows = data.purchaseAnalytics.spendingByBrand.slice(0, 10).map((item, index) => [
      index + 1,
      item.name,
      formatCurrency(item.value),
    ]);

    autoTable(doc, {
      startY: y,
      head: [["Chi phí nhập theo thương hiệu", "Thương hiệu", "Tổng chi phí"]],
      body: spendingRows,
      ...getPdfTableStyles(doc),
      headStyles: { 
        fontStyle: 'normal',
        fillColor: [168, 85, 247],
        textColor: [255, 255, 255]
      },
      columnStyles: { 0: { halign: "center", cellWidth: 24 } },
    });

    y = (doc as any).lastAutoTable.finalY + 8;

    if (options?.includeCharts !== false) {
      y = drawBarChartSection(
        doc,
        "BIỂU ĐỒ TRẠNG THÁI ĐƠN HÀNG",
        data.orderManagement.statusDistribution.slice(0, 5).map((item) => ({ label: item.status, value: item.count })),
        [239, 68, 68],
        y
      );

      y = drawBarChartSection(
        doc,
        "BIỂU ĐỒ CHI PHÍ NHẬP THEO THƯƠNG HIỆU",
        data.purchaseAnalytics.spendingByBrand.slice(0, 5).map((item) => ({ label: item.name, value: item.value })),
        [168, 85, 247],
        y
      );
    }
  }

  const fileName = `${mode === "simple" ? "Dashboard-Tong-Quan" : "Dashboard-Nang-Cao"}-${new Date().getTime()}.pdf`;
  doc.save(fileName);
};

/**
 * Xuất dữ liệu Dashboard ra file Excel
 */
export const exportDashboardToExcel = async (
  data: DashboardResponseDTO,
  mode: DashboardMode,
  options?: ExportOptions
) => {
  const { XLSX } = await loadExportLibs();
  const wb = XLSX.utils.book_new();

  const metricsSheet = XLSX.utils.json_to_sheet(
    buildMetricsRows(data).map((row) => ({
      "Chỉ số": row[0],
      "Giá trị": row[1],
      "Xu hướng": row[2],
      "Bộ lọc": options?.timeFilter || "N/A",
      "Ngày bắt đầu": options?.startDate || "N/A",
      "Ngày kết thúc": options?.endDate || "N/A",
    }))
  );

  const topProductsSheet = XLSX.utils.json_to_sheet(
    data.bestSellingProducts.map((item, index) => ({
      "Hạng": index + 1,
      "Sản phẩm": item.name,
      "Số lượng bán": item.sales,
    }))
  );

  const topVariantsSheet = XLSX.utils.json_to_sheet(
    data.bestSellingVariants.map((item, index) => ({
      "Hạng": index + 1,
      "Biến thể": item.name,
      "Số lượng bán": item.sales,
    }))
  );

  const marketShareSheet = XLSX.utils.json_to_sheet(
    data.brandAnalytics.marketShare.map((item, index) => ({
      "Hạng": index + 1,
      "Thương hiệu": item.name,
      "Giá trị": item.value,
    }))
  );

  XLSX.utils.book_append_sheet(wb, metricsSheet, "Chỉ số");
  XLSX.utils.book_append_sheet(wb, topProductsSheet, "Top sản phẩm");

  if (mode === "simple") {
    XLSX.utils.book_append_sheet(wb, topVariantsSheet, "Top biến thể");
    XLSX.utils.book_append_sheet(wb, marketShareSheet, "Thị phần");
  } else {
    const orderStatusSheet = XLSX.utils.json_to_sheet(
      data.orderManagement.statusDistribution.map((item, index) => ({
        "Hạng": index + 1,
        "Trạng thái": item.status,
        "Số lượng": item.count,
      }))
    );

    const spendingByBrandSheet = XLSX.utils.json_to_sheet(
      data.purchaseAnalytics.spendingByBrand.map((item, index) => ({
        "Hạng": index + 1,
        "Thương hiệu": item.name,
        "Chi phí": item.value,
      }))
    );

    XLSX.utils.book_append_sheet(wb, orderStatusSheet, "Trạng thái ĐH");
    XLSX.utils.book_append_sheet(wb, spendingByBrandSheet, "Chi phí Nhập");
  }

  const fileName = `${mode === "simple" ? "Dashboard-Tong-Quan" : "Dashboard-Nang-Cao"}-${new Date().getTime()}.xlsx`;
  XLSX.writeFile(wb, fileName);
};
