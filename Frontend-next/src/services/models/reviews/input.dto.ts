export interface CreateReviewDto {
  productId: string;
  rating: number;
  comment: string;
}
export interface ReplyReviewDto {
  comment: string;
}