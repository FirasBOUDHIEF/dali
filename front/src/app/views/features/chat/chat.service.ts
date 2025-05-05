import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = 'http://localhost:8086/api/chats';

  constructor(private http: HttpClient) {}

  getUserChats(userId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }

  getMessages(chatId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/${chatId}/messages`);
  }

  sendMessage(chatId: number, senderId: number, content: string) {
    return this.http.post<any>(`${this.apiUrl}/${chatId}/send`, {
      senderId,
      content,
    });
  }

  startChat(clientId: number, freelancerId: number, canalName: string) {
    return this.http.post<any>(`${this.apiUrl}/start`, {
      clientId,
      freelancerId,
      canalName,
    });
  }
}
