// review.model.ts
export interface Review {
  id: number;
  reviewerId: any;
  reviewedId: any;
  comment: string;
  rating: any;
  createdAt: Date;
}
