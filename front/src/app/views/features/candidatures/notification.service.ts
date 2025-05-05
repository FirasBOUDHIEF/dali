import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl = 'http://localhost:8085/api/notifications';

  constructor(private http: HttpClient) {}

  sendNotification(
    userId: number,
    email: string,
    subject: string,
    message: string
  ) {
    return this.http.post(`${this.apiUrl}/send`, null, {
      params: {
        userId: userId.toString(),
        email,
        subject,
        message,
      },
    });
  }

  getUnreadNotifications(userId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/${userId}`);
  }

  markAsRead(notificationId: number) {
    return this.http.post(`${this.apiUrl}/mark-read/${notificationId}`, {});
  }
}
