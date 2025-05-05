import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Review } from './Review';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = 'http://localhost:8087/api/reviews';

  constructor(private http: HttpClient) {}

  getReviews(reviewedId: any): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/${reviewedId}`);
  }

  getAverageRating(reviewedId: any): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/average/${reviewedId}`);
  }

  submitReview(review: Partial<Review>): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, review);
  }

  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
