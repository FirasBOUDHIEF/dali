import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from '../mytasks/models';
import { Observable } from 'rxjs';
import { Candidature } from './condidature';

@Injectable({
  providedIn: 'root',
})
export class FreelanceService {
  private apiUrl = 'http://localhost:8084/api/candidatures';

  constructor(private http: HttpClient) {}

  create(candidature: any): Observable<any> {
    return this.http.post(this.apiUrl, candidature);
  }

  getByFreelanceId(freelanceId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/freelance/${freelanceId}`);
  }
}
