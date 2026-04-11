export interface BrandResponseDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: { id: string; url: string } | null;
  banner: { id: string; url: string } | null;
  createdAt: string;
  updatedAt: string;
}
