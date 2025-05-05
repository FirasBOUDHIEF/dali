import { Component } from '@angular/core';
import { Candidature } from './condidature';
import { Task } from '../mytasks/models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FreelanceService } from './freelance.service';
import { AuthServiceService } from '../auth/login/auth-service.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../mytasks/task.service';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.scss',
})
export class BrowseComponent {
  tasks: Task[] = [];
  selectedTask!: Task;
  application: any = {
    motivation: '',
    withCv: true,
  };
  freelanceId!: any;
  hasResume: boolean = false;
  appliedTaskIds: number[] = [];

  constructor(
    private modalService: NgbModal,
    private taskService: TaskService,
    private candidatureService: FreelanceService,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.freelanceId = this.authService.getCurrentUserId();
    this.checkResumeStatus();
    this.loadTasks();
    this.loadApplications();
  }

  private loadTasks(): void {
    this.taskService.getAllTasks().subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  private loadApplications(): void {
    this.candidatureService
      .getByFreelanceId(this.freelanceId)
      .subscribe((applications) => {
        this.appliedTaskIds = applications.map((a) => a.taskid);
      });
  }

  private checkResumeStatus(): void {
    // Assume this method checks if resume exists
    // this.authService.getProfile(this.freelanceId).subscribe((profile) => {
    //   this.hasResume = !!profile.resumeUrl;
    // });
  }

  openApplyModal(task: Task, content: any): void {
    this.selectedTask = task;
    this.resetApplicationForm();
    this.modalService.open(content).result.then(
      () => this.handleApplicationSuccess(),
      () => this.resetApplicationForm()
    );
  }

  submitApplication(): void {
    const email: String = localStorage.getItem('email');
    const candidature = {
      taskid: this.selectedTask.id,
      freelanceid: this.freelanceId,
      motivation: this.application.motivation,
      withCv: this.application.withCv,
      freelancerEmail: email,
    };
    console.log(candidature);

    this.candidatureService.create(candidature).subscribe({
      next: () => {
        this.modalService.dismissAll();
        Swal.fire('Success!', 'Application submitted successfully', 'success');
        this.loadApplications();
      },
      error: (err) => {
        Swal.fire('Error!', 'Application failed: ' + err.message, 'error');
      },
    });
  }

  hasApplied(taskId: number): boolean {
    return this.appliedTaskIds.includes(taskId);
  }

  private resetApplicationForm(): void {
    this.application = {
      motivation: '',
      withCv: false,
    };
  }

  private handleApplicationSuccess(): void {
    this.resetApplicationForm();
  }
}
