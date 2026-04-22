import * as XLSX from 'xlsx';
import { CreateVariantInput } from '@/src/services/models/product/input.dto';

export type ImportedVariant = CreateVariantInput & { productName: string };

/**
 * Parses Excel rows to ImportedVariant objects
 */
export const parseVariantExcel = (file: File): Promise<ImportedVariant[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const rows: any[][] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

        if (rows.length < 2) {
          resolve([]);
          return;
        }

        const header = rows[0].map(h => h?.toString().toLowerCase().trim());
        
        // Find column indices
        const idxProduct = header.findIndex(h => h.includes('sản phẩm') || h.includes('product'));
        const idxColor = header.findIndex(h => h.includes('màu') || h.includes('color'));
        const idxSize = header.findIndex(h => h.includes('kích cỡ') || h.includes('size'));
        const idxPrice = header.findIndex(h => h.includes('giá bán') || h.includes('price'));
        const idxSalePrice = header.findIndex(h => h.includes('giá khuyến mãi') || h.includes('sale'));
        const idxCostPrice = header.findIndex(h => h.includes('giá nhập') || h.includes('cost'));
        const idxSku = header.findIndex(h => h.includes('sku'));
        const idxStatusName = header.findIndex(h => h.includes('nhãn') || h.includes('tag'));
        const idxImageUrl = header.findIndex(h => h.includes('ảnh') || h.includes('image'));

        if (idxProduct === -1 || idxPrice === -1) {
          throw new Error('File không đúng định dạng. Cần ít nhất cột "Sản phẩm" và "Giá bán".');
        }

        const variants: ImportedVariant[] = [];

        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          const productName = row[idxProduct]?.toString().trim();
          if (!productName) continue;

          variants.push({
            productName,
            color: row[idxColor]?.toString().trim() || undefined,
            size: row[idxSize]?.toString().trim() || undefined,
            price: parseFloat(row[idxPrice]) || 0,
            salePrice: row[idxSalePrice] ? parseFloat(row[idxSalePrice]) : undefined,
            costPrice: row[idxCostPrice] ? parseFloat(row[idxCostPrice]) : 0,
            sku: row[idxSku]?.toString().trim() || undefined,
            statusName: row[idxStatusName]?.toString().toUpperCase() as any || "NEW",
            imageUrl: row[idxImageUrl]?.toString().trim() || null
          });
        }

        resolve(variants);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};

/**
 * Downloads a template Excel for variants
 */
export const downloadVariantTemplate = () => {
  const data = [
    ['Sản phẩm', 'Màu sắc', 'Kích cỡ', 'Giá bán', 'Giá khuyến mãi', 'Giá nhập', 'SKU', 'Nhãn (NEW/BEST_SELLING/TRENDING/SALE)', 'Link ảnh đại diện'],
    ['Son MAC Matte Lipstick', 'Đỏ Ruby', '3g', 450000, 399000, 300000, 'MAC-RUBY-01', 'BEST_SELLING', 'https://example.com/image.jpg'],
    ['Son MAC Matte Lipstick', 'Hồng Đào', '3g', 450000, 420000, 300000, 'MAC-PEACH-01', 'NEW', ''],
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Template Import Biến Thể');
  XLSX.writeFile(wb, 'Variant-Import-Template.xlsx');
};
