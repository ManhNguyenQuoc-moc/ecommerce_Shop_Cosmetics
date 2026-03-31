import { ProductSpecificationDTO } from "./AddProductDTO";

export interface UpdateVariantDTO {
    id?: string;
    sku?: string;
    color?: string;
    size?: string;
    price: number;
    salePrice?: number | null;
    imageUrl?: string | null;
    imageId?: string | null;
    statusName?: 'BEST_SELLING' | 'TRENDING' | 'NEW';
}

export interface UpdateProductDTO {
    name: string;
    brandId?: string;
    categoryId?: string;
    short_description?: string;
    long_description?: string;
    status?: 'ACTIVE' | 'HIDDEN' | 'STOPPED';
    price?: number;
    salePrice?: number | null;
    specifications?: ProductSpecificationDTO[];
    newImages?: string[]; // URLs of new images added to gallery
    imageIdsToRemove?: string[]; // IDs of existing gallery images to remove
    variants?: UpdateVariantDTO[];
}
