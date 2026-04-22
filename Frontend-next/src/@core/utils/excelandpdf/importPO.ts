import * as XLSX from "xlsx";
import dayjs from "dayjs";

export interface ImportedReceiptItem {
  variantId: string;
  qty: number;
  batch: string;
  mfg: dayjs.Dayjs | null;
  expiry: dayjs.Dayjs | null;
}

export const importReceiptFromExcel = async (file: File, expectedPoCode?: string): Promise<ImportedReceiptItem[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array", cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        const rows: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (rows.length < 1 || !rows[0][0]?.toString().includes("STOCK RECEIPT TEMPLATE")) {
          reject(new Error("File không đúng định dạng mẫu nhập kho (Thiếu tiêu đề STOCK RECEIPT TEMPLATE)."));
          return;
        }

        // Validate PO Number if expected
        if (expectedPoCode) {
          let foundPoRow = rows.find(r => r[0] === "PO Number:");
          if (foundPoRow && foundPoRow[1]?.toString().trim() !== expectedPoCode) {
            reject(new Error(`File Excel này thuộc về mã phiếu ${foundPoRow[1]}, vui lòng chọn đúng file của phiếu ${expectedPoCode}.`));
            return;
          }
        }

        const results: ImportedReceiptItem[] = [];
        
        let headerIndex = -1;
        for (let i = 0; i < rows.length; i++) {
          if (rows[i].includes("Variant ID") && rows[i].includes("Qty to Import")) {
            headerIndex = i;
            break;
          }
        }

        if (headerIndex === -1) {
          reject(new Error("Không tìm thấy cấu trúc bảng hợp lệ (Thiếu các cột Qty to Import, Variant ID...)."));
          return;
        }

        const dataRows = rows.slice(headerIndex + 1);
        const headers = rows[headerIndex];

        const getColIndex = (name: string) => headers.indexOf(name);
        
        const idxQty = getColIndex("Qty to Import");
        const idxBatch = getColIndex("Batch Number");
        const idxMfg = getColIndex("MFG Date (DD/MM/YYYY)");
        const idxExpiry = getColIndex("Expiry Date (DD/MM/YYYY)");
        const idxVariantId = getColIndex("Variant ID");

        dataRows.forEach((row) => {
          const variantId = row[idxVariantId];
          const qty = parseFloat(row[idxQty]);
          if (!variantId || isNaN(qty) || qty <= 0) return;

          const batch = row[idxBatch]?.toString() || "";
          
          let mfg: dayjs.Dayjs | null = null;
          let expiry: dayjs.Dayjs | null = null;

          const parseDate = (val: any) => {
            if (!val) return null;
            if (val instanceof Date) return dayjs(val);
            // Try parsing string DD/MM/YYYY
            const d = dayjs(val, "DD/MM/YYYY");
            return d.isValid() ? d : null;
          };

          mfg = parseDate(row[idxMfg]);
          expiry = parseDate(row[idxExpiry]);

          results.push({
            variantId,
            qty,
            batch,
            mfg,
            expiry
          });
        });

        resolve(results);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
};
