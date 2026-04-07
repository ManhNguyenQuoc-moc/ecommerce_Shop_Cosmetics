export interface CreateCategoryGroupDto {
    name: string;
    description?: string;
}

export interface UpdateCategoryGroupDto {
    name?: string;
    description?: string;
}

export interface CategoryGroupQueryFilters {
    search?: string;
    page?: number;
    pageSize?: number;
}
