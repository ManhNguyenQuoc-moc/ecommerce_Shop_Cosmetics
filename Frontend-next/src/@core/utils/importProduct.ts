import * as XLSX from "xlsx";
import { CreateProductInput, CreateVariantInput, ProductSpecificationInput } from "@/src/services/models/product/input.dto";

export interface ParsedProductRow {
  name: string;
  brand: string;
  category: string;
  shortDescription?: string;
  longDescription?: string;
  status?: 'ACTIVE' | 'HIDDEN' | 'STOPPED';
  sku?: string;
  color?: string;
  size?: string;
  costPrice?: number;
  price: number;
  salePrice?: number | null;
  statusName?: 'BEST_SELLING' | 'TRENDING' | 'NEW';
  imageUrl?: string;
  galleryUrls?: string[];
  specifications?: ProductSpecificationInput[];
}

export const parseProductExcel = async (file: File): Promise<CreateProductInput[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array", cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        const rows: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (rows.length < 2) {
          reject(new Error("File không có dữ liệu hoặc thiếu dòng tiêu đề."));
          return;
        }

        const headers = rows[0] as string[];
        const getColIndex = (name: string) => headers.findIndex(h => h.toLowerCase().includes(name.toLowerCase()));

        const idxName = getColIndex("Sản phẩm");
        const idxBrand = getColIndex("Thương hiệu");
        const idxCategory = getColIndex("Danh mục");
        const idxShortDesc = getColIndex("Mô tả ngắn");
        const idxLongDesc = getColIndex("Mô tả chi tiết");
        const idxSku = getColIndex("SKU");
        const idxColor = getColIndex("Màu sắc");
        const idxSize = getColIndex("Kích cỡ");
        const idxCostPrice = getColIndex("Giá nhập");
        const idxPrice = getColIndex("Giá bán");
        const idxSalePrice = getColIndex("Giá KM");
        const idxStatusName = getColIndex("Nhãn");
        const idxImageUrl = getColIndex("Ảnh biến thể");
        const idxGallery = getColIndex("Ảnh sản phẩm");
        const idxSpecs = getColIndex("Thông số");

        if (idxName === -1 || idxPrice === -1) {
          reject(new Error("File thiếu cột bắt buộc: 'Sản phẩm' hoặc 'Giá bán'."));
          return;
        }

        const productsMap = new Map<string, CreateProductInput>();

        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          const name = row[idxName]?.toString().trim();
          if (!name) continue;

          let product = productsMap.get(name);
          if (!product) {
            const gallery = row[idxGallery]?.toString().split(";").filter(Boolean).map((s: string) => s.trim()) || [];
            const specsStr = row[idxSpecs]?.toString() || "";
            const specs: ProductSpecificationInput[] = specsStr.split(";").filter(Boolean).map((s: string) => {
              const [label, value] = s.split("|");
              return { label: label?.trim(), value: value?.trim() };
            }).filter((s: any) => s.label && s.value);

            product = {
              name,
              brandId: row[idxBrand]?.toString().trim() || "",
              categoryId: row[idxCategory]?.toString().trim() || "",
              short_description: row[idxShortDesc]?.toString().trim(),
              long_description: row[idxLongDesc]?.toString().trim(),
              status: "HIDDEN",
              specifications: specs,
              images: gallery,
              variants: []
            };
            productsMap.set(name, product);
          }

          if (product) {
            // Add variant
            const variant: CreateVariantInput = {
              sku: row[idxSku]?.toString().trim() || undefined,
              color: row[idxColor]?.toString().trim() || undefined,
              size: row[idxSize]?.toString().trim() || undefined,
              price: parseFloat(row[idxPrice]) || 0,
              salePrice: row[idxSalePrice] ? parseFloat(row[idxSalePrice]) : undefined,
              costPrice: row[idxCostPrice] ? parseFloat(row[idxCostPrice]) : 0,
              imageUrl: row[idxImageUrl]?.toString().trim() || null,
              statusName: row[idxStatusName]?.toString().toUpperCase() as any || "NEW"
            };
            product.variants.push(variant);
          }
        }

        resolve(Array.from(productsMap.values()));
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
};

export const downloadProductTemplate = () => {
  const wsData = [
    ["Sản phẩm", "Thương hiệu", "Danh mục", "Mô tả ngắn", "Mô tả chi tiết", "SKU", "Màu sắc", "Kích cỡ", "Giá nhập", "Giá bán", "Giá KM", "Nhãn", "Ảnh biến thể", "Ảnh sản phẩm", "Thông số"],
    ["Son MAC Matte Lipstick", "MAC", "Son môi", "Son lì cao cấp", "Chi tiết về sản phẩm...", "MAC-MATTE-RED", "Ruby Woo", "3g", "450000", "550000", "499000", "BEST_SELLING", "https://url-anh-bien-the.com", "url1;url2;url3", "Loại da|Mọi loại da;Xuất xứ|USA"],
    ["Son MAC Matte Lipstick", "MAC", "Son môi", "Son lì cao cấp", "Chi tiết về sản phẩm...", "MAC-MATTE-PINK", "Pink Pigeon", "3g", "450000", "550000", "", "NEW", "https://url-anh-bien-the-2.com", "url1;url2;url3", "Loại da|Mọi loại da;Xuất xứ|USA"]
  ];

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Product Template");
  XLSX.writeFile(wb, "Product-Import-Template.xlsx");
};
