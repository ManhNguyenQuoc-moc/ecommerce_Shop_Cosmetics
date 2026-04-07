export interface CreateCategoryDto {
    name: string;
    description?: string;
    image?: { url: string } | null;
    categoryGroupId?: string | null;
}

export interface UpdateCategoryDto {
    name?: string;
    description?: string;
    imageId?: string | null;
    categoryGroupId?: string | null;
}

export interface CategoryQueryFilters {
    search?: string;
    page?: number;
    pageSize?: number;
}
