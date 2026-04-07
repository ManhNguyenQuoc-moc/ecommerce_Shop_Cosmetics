export interface CreateCategoryDTO {
  name: string;
  description?: string;
  image?: { url: string } | null;
  categoryGroupId?: string | null;
}
