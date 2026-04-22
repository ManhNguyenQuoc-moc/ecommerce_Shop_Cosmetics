import { ROBOTO_REGULAR_BASE64 } from "./fontRoboto";

export type ExportLibs = {
  XLSX: typeof import("xlsx");
  jsPDF: typeof import("jspdf").default;
  autoTable: typeof import("jspdf-autotable").default;
};

let exportLibsPromise: Promise<ExportLibs> | null = null;

/**
 * Tải các thư viện xuất file một cách dynamic để giảm bundle size ban đầu
 */
export const loadExportLibs = async (): Promise<ExportLibs> => {
  if (!exportLibsPromise) {
    exportLibsPromise = Promise.all([
      import("xlsx"),
      import("jspdf"),
      import("jspdf-autotable"),
    ]).then(([XLSX, jsPDFModule, autoTableModule]) => ({
      XLSX,
      jsPDF: jsPDFModule.default,
      autoTable: autoTableModule.default,
    }));
  }

  return exportLibsPromise;
};

/**
 * Làm sạch chuỗi Base64
 */
export const cleanBase64 = (base64: string): string => {
  if (!base64) return "";
  const base64Clean = base64.includes(",") ? base64.split(",")[1] : base64;
  return base64Clean.replace(/\s/g, "");
};

/**
 * Tải font từ URL
 */
export const loadFontFromUrl = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch font: ${response.statusText}`);
    const arrayBuffer = await response.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let binary = "";
    const len = bytes.byteLength;
    const chunk = 8192;
    for (let i = 0; i < len; i += chunk) {
      binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
    }
    return btoa(binary);
  } catch (error) {
    console.error("Error loading font from URL:", error);
    return "";
  }
};

/**
 * Thiết lập font Roboto cho jsPDF để hỗ trợ Unicode (Tiếng Việt)
 */
export const setupPdfFont = async (doc: any) => {
  try {
    let fontBase64 = cleanBase64(ROBOTO_REGULAR_BASE64);
    if (!fontBase64 || fontBase64.length < 500) {
      fontBase64 = await loadFontFromUrl("https://cdn.jsdelivr.net/gh/googlefonts/roboto@master/src/hinted/Roboto-Regular.ttf");
    }

    if (fontBase64) {
      doc.addFileToVFS("Roboto-Regular.ttf", fontBase64);
      doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
      doc.addFont("Roboto-Regular.ttf", "Roboto", "bold");
      doc.setFont("Roboto");
      return true;
    }
  } catch (e) {
    console.error("Error setting up PDF font:", e);
  }
  return false;
};

/**
 * Format tiền tệ VNĐ
 */
export const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('vi-VN').format(val) + " đ";
};

/**
 * Cấu hình Style chung cho Table trong PDF
 */
export const getPdfTableStyles = (doc: any) => ({
  styles: {
    font: doc.getFont()?.fontName === "Roboto" ? "Roboto" : "helvetica",
    fontSize: 8,
    cellPadding: 3,
  },
  headStyles: {
    fontStyle: 'normal' as const,
    fillColor: [41, 128, 185] as [number, number, number],
    textColor: [255, 255, 255] as [number, number, number],
    halign: 'center' as const,
  },
});
