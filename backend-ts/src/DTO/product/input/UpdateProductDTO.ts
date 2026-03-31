export interface UpdateVariantDTO {
    id: string;
    sku?: string;
    color?: string;
    size?: string;
    price: number;
    salePrice?: number;
    newImages?: Express.Multer.File[]; 
    imageUrl?: string;
    imageId?: string;
    statusName?: 'BEST_SELLING' | 'TRENDING' | 'NEW';
}

export interface UpdateProductDTO {
    name: string;
    brandId?: string;
    categoryId?: string;
    short_description?: string;
    long_description?: string;
    status?: 'ACTIVE' | 'HIDDEN' | 'STOPPED';
    price: number;
    salePrice?: number;
    specifications?: any;
    newProductImages?: Express.Multer.File[];
    images?: string[];
    variants?: UpdateVariantDTO[];
}
