import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CandidatureService {
  private apiUrl = 'http://localhost:8084/api/candidatures';

  constructor(private http: HttpClient) {}

  getByTaskId(taskId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/task/${taskId}`);
  }
  getAllCandidatures(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  confirm(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/confirm`, {});
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
