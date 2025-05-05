import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  NgbDropdownModule,
  NgbNavModule,
  NgbTooltip,
} from '@ng-bootstrap/ng-bootstrap';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ChatService } from './chat.service';
import { AuthServiceService } from '../auth/login/auth-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    NgbNavModule,
    NgbDropdownModule,
    NgScrollbarModule,
    NgbTooltip,
    CommonModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, AfterViewInit {
  defaultNavActiveId = 1;
  currentUserId!: any;
  currentUserName!: string;
  currentUserRole!: string;
  currentUserImage!: string;
  chats: any[] = [];
  selectedChat!: any;
  newMessage = '';

  constructor(
    private http: HttpClient,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUserId();
    this.loadUserProfile();
    this.loadChats();
  }

  ngAfterViewInit(): void {
    // Mobile chat list handling
    const chatItems = document.querySelectorAll('.chat-list .chat-item');
    chatItems.forEach((item) => {
      item.addEventListener('click', () => {
        document.querySelector('.chat-content')?.classList.toggle('show');
      });
    });
  }

  loadUserProfile(): void {
    this.http
      .get<any>(`http://localhost:8082/api/user/${this.currentUserId}`)
      .subscribe((user) => {
        this.currentUserName = user.username;
        this.currentUserRole = user.role;
        this.currentUserImage = `http://localhost:8082/api/user/${this.currentUserId}/image`;
      });
  }

  loadChats(): void {
    this.http
      .get<any[]>(`http://localhost:8086/api/chats/user/${this.currentUserId}`)
      .subscribe((chats) => {
        this.chats = chats;
        console.log(this.chats);
      });
  }

  selectChat(chat: any): void {
    this.selectedChat = chat;
    this.http
      .get<any[]>(`http://localhost:8086/api/chats/${chat.id}/messages`)
      .subscribe((messages) => {
        this.selectedChat.messages = messages;
        this.markMessagesAsRead();
      });
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    const message = {
      senderId: this.currentUserId,
      content: this.newMessage.trim(),
    };
    this.http
      .post<any>(
        `http://localhost:8086/api/chats/${this.selectedChat.id}/send`,
        null,
        {
          params: {
            senderId: this.currentUserId,
            content: this.newMessage.trim(),
          },
        }
      )
      .subscribe((newMessage) => {
        this.selectedChat.messages.push({ ...newMessage, read: false });
        this.newMessage = '';
      });
  }

  getOtherUserImage(chat: any): string {
    const otherUserId =
      chat.user1Id == this.currentUserId ? chat.user2Id : chat.user1Id;
    console.log(chat.user1Id);
    console.log(this.currentUserId);
    console.log(chat.user1Id === this.currentUserId);

    return `http://localhost:8082/api/user/${otherUserId}/image`;
  }

  getOtherUserName(chat: any): string {
    const otherUserId =
      chat.user1Id === this.currentUserId ? chat.user2Id : chat.user1Id;
    return `User ${otherUserId}`; // Replace with actual user name fetch
  }

  getLastMessage(chat: any): any | null {
    return chat.messages?.length > 0
      ? chat.messages[chat.messages.length - 1]
      : null;
  }

  hasUnreadMessages(chat: any): boolean {
    return chat.messages?.some(
      (m) => !m.read && m.senderId !== this.currentUserId
    );
  }

  unreadCount(chat: any): number {
    return (
      chat.messages?.filter((m) => !m.read && m.senderId !== this.currentUserId)
        .length || 0
    );
  }

  getUserImage(userId: number): string {
    return `http://localhost:8082/api/user/${userId}/image`;
  }

  private calculateUnreadCount(chat: any): number {
    return (
      chat.messages?.filter((m) => !m.read && m.senderId !== this.currentUserId)
        .length || 0
    );
  }

  private markMessagesAsRead(): void {
    const unreadMessages = this.selectedChat.messages.filter(
      (m) => !m.read && m.senderId !== this.currentUserId
    );
    unreadMessages.forEach((message) => {
      this.http
        .patch(`http://localhost:8086/api/messages/${message.id}/read`, {})
        .subscribe(() => (message.read = true));
    });
  }
}
