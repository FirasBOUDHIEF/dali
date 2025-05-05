import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { CandidatureService } from '../candidature.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FeatherIconDirective } from '../../../core/feather-icon/feather-icon.directive';
import { NotificationService } from './notification.service';
import { ChatServiceService } from './chat-service.service';
import { AuthServiceService } from '../auth/login/auth-service.service';

@Component({
  selector: 'app-candidatures',
  standalone: true,
  imports: [CommonModule, FeatherIconDirective, RouterLink],
  templateUrl: './candidatures.component.html',
  styleUrl: './candidatures.component.scss',
})
export class CandidaturesComponent implements OnInit {
  taskId!: number;
  candidatures: any[] = [];
  isLoading = false;
  errorMessage = '';
  currentClientId: any;

  constructor(
    private route: ActivatedRoute,
    private candidatureService: CandidatureService,

    private notificationService: NotificationService,
    private chatService: ChatServiceService,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.taskId = +params.get('id')!;
      this.loadCandidatures();
    });
    this.currentClientId = this.authService.getCurrentUserId();
  }

  private loadCandidatures(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.candidatureService.getByTaskId(this.taskId).subscribe({
      next: (candidatures) => {
        this.candidatures = candidatures;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load applications';
        this.isLoading = false;
        console.error('Error loading candidatures:', err);
      },
    });
  }

  confirmApplication(candidatureId: number): void {
    Swal.fire({
      title: 'Confirm Application',
      text: 'Are you sure you want to confirm this application?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, confirm it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.candidatureService.confirm(candidatureId).subscribe({
          next: () => {
            const candidature = this.candidatures.find(
              (c) => c.id === candidatureId
            );

            // Send notification
            this.notificationService
              .sendNotification(
                candidature.freelanceid,
                candidature.freelancerEmail,
                'Application Confirmed',
                `Your application for task #${this.taskId} has been approved!`
              )
              .subscribe();

            // Start chat
            this.chatService
              .startChat(
                this.currentClientId,
                candidature.freelanceid,
                `Task-${this.taskId}`
              )
              .subscribe();

            this.candidatures = this.candidatures.map((c) =>
              c.id === candidatureId ? { ...c, confirmed: true } : c
            );
            Swal.fire(
              'Confirmed!',
              'Application has been confirmed.',
              'success'
            );
          },
          error: (err) => {
            Swal.fire('Error!', 'Confirmation failed.', 'error');
          },
        });
      }
    });
  }

  deleteApplication(candidatureId: number): void {
    Swal.fire({
      title: 'Delete Application',
      text: 'Are you sure you want to delete this application?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.candidatureService.delete(candidatureId).subscribe({
          next: () => {
            this.candidatures = this.candidatures.filter(
              (c) => c.id !== candidatureId
            );
            Swal.fire('Deleted!', 'Application has been deleted.', 'success');
          },
          error: (err) => {
            Swal.fire('Error!', 'Deletion failed.', 'error');
          },
        });
      }
    });
  }
}
