import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { TaskService } from '../mytasks/task.service';
import { AuthServiceService } from '../auth/login/auth-service.service';

@Component({
  selector: 'app-my-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-task.component.html',
  styleUrl: './my-task.component.scss',
})
export class MyTaskComponent implements OnInit {
  @ViewChild('editModal') editModal!: TemplateRef<any>;
  tasks: any[] = [];
  selectedTask: any;
  freelancerId!: any;

  constructor(
    private modalService: NgbModal,
    private taskService: TaskService,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.freelancerId = this.authService.getCurrentUserId();
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasksByFreelancerId(this.freelancerId).subscribe({
      next: (tasks) => (this.tasks = tasks),
      error: (err) => console.error('Error loading tasks:', err),
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'OPEN':
        return 'bg-primary';
      case 'IN_PROGRESS':
        return 'bg-warning';
      case 'COMPLETED':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }

  openEditModal(task: any): void {
    this.selectedTask = { ...task };
    this.modalService.open(this.editModal).result.then(
      () => this.loadTasks(),
      () => {}
    );
  }

  updateTask(): void {
    this.taskService
      .updateTask(this.selectedTask.id, this.selectedTask)
      .subscribe({
        next: () => {
          Swal.fire('Success!', 'Task updated successfully', 'success');
          this.loadTasks();
        },
        error: (err) => Swal.fire('Error!', 'Failed to update task', 'error'),
      });
  }

  markTaskAsComplete(taskId: number): void {
    Swal.fire({
      title: 'Mark as Complete?',
      text: 'Are you sure you want to mark this task as completed?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, mark complete!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.taskService.markTaskAsComplete(taskId).subscribe({
          next: () => {
            Swal.fire('Completed!', 'Task marked as completed', 'success');
            this.loadTasks();
          },
          error: (err) =>
            Swal.fire('Error!', 'Failed to complete task', 'error'),
        });
      }
    });
  }
}
