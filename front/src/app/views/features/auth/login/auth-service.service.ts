import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private apiUrl = 'http://localhost:8082/api';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl + '/user/login', { username, password });
  }

  logout() {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUserId(): string | null {
    return localStorage.getItem('userId');
  }
  getUserById(userId: any): Observable<any> {
    return this.http.get(this.apiUrl + '/user/' + userId);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/register`, {
      role: userData.role,
      email: userData.email,
      username: userData.username,
      password: userData.password,
    });
  }
}
