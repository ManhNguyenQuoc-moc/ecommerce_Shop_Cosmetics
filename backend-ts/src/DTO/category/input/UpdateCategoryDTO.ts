export interface UpdateCategoryDTO {
  name?: string;
  description?: string;
  image?: { url: string } | null;
}
