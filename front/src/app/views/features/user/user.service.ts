import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8082/api/user';

  constructor(private http: HttpClient) {}

  getAllFreelancers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/allfreelancer`);
  }

  getAllClients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/allclients`);
  }

  getAllAdmins(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/alladmins`);
  }
}
