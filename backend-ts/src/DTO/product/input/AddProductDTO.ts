export interface CreateVariantDTO {
    sku?: string;
    color?: string;
    size?: string;
    price: number;
    salePrice?: number;
    // For handling images mapped via Multer
    newImages?: Express.Multer.File[]; 
    // Fallback if frontend sends base64/URL instead
    imageUrl?: string;
    // Dynamically injected after Cloudinary upload
    imageId?: string;
    
    statusName?: 'BEST_SELLING' | 'TRENDING' | 'NEW';
}

export interface CreateProductDTO {
    name: string;
    brandId?: string;
    categoryId?: string;
    short_description?: string;
    long_description?: string;
    status?: 'ACTIVE' | 'HIDDEN' | 'STOPPED';
    price: number;
    salePrice?: number;
    specifications?: any;
    
    // Array of files from Multer
    newProductImages?: Express.Multer.File[];
    // Fallback if frontend sends arrays of base64/URL instead
    images?: string[];

    variants?: CreateVariantDTO[];
}
