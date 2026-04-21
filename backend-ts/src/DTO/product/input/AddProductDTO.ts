export interface ProductSpecificationDTO {
    label: string;
    value: string;
}

export interface CreateVariantDTO {
    sku?: string;
    color?: string;
    size?: string;
    price: number;
    salePrice?: number | null;
    costPrice?: number;
    imageUrl?: string | null;
    imageId?: string | null;
    statusName?: 'BEST_SELLING' | 'TRENDING' | 'NEW';
}

export interface CreateProductDTO {
    name: string;
    brandId?: string;
    categoryId?: string;
    short_description?: string;
    long_description?: string;
    status?: 'ACTIVE' | 'HIDDEN' | 'STOPPED';
    specifications?: ProductSpecificationDTO[];
    images?: string[]; 
    variants?: CreateVariantDTO[];
}
