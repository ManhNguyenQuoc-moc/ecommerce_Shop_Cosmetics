export interface CategoryResponseDto {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    imageId: string | null;
    image?: { id: string; url: string } | null;
    createdAt: string;
    updatedAt: string;
    categoryGroupId?: string | null;
    categoryGroup?: { id: string; name: string; slug: string } | null;
}
