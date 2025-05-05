import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8082/api';

  constructor(private http: HttpClient) {}

  updateUser(userData: any, userId: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/${userId}`, userData);
  }
}
