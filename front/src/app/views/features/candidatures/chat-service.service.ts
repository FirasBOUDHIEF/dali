import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChatServiceService {
  private apiUrl = 'http://localhost:8086/api/chats';

  constructor(private http: HttpClient) {}

  startChat(clientId: number, freelancerId: number, canalName: string) {
    return this.http.post(`${this.apiUrl}/start`, null, {
      params: {
        clientId: clientId.toString(),
        freelancerId: freelancerId.toString(),
        canalName,
      },
    });
  }
}
