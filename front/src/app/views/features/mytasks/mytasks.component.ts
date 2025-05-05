import { Component, OnInit, TemplateRef } from '@angular/core';
import { FeatherIconDirective } from '../../../core/feather-icon/feather-icon.directive';
import {
  NgbDatepickerModule,
  NgbDateStruct,
  NgbDropdownModule,
  NgbModal,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';
import { RouterLink } from '@angular/router';
import { CommonModule, JsonPipe } from '@angular/common';
import { AuthServiceService } from '../auth/login/auth-service.service';
import { TaskService } from './task.service';
import { Task } from './models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mytasks',
  standalone: true,
  imports: [
    CommonModule,
    NgbDropdownModule,
    FeatherIconDirective,
    RouterLink,
    TagInputModule,
    FormsModule,
    JsonPipe,
    NgbDatepickerModule,
    NgbTooltipModule,
  ],
  templateUrl: './mytasks.component.html',
  styleUrl: './mytasks.component.scss',
})
export class MytasksComponent implements OnInit {
  tasks: Task[] = [];
  currentUserId!: any;
  isEditMode = false;
  selectedTask!: Task;
  itemsAsObjects: { name: string }[] = [];

  constructor(
    private modalService: NgbModal,
    private taskService: TaskService,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUserId();
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasksByClientId(this.currentUserId).subscribe({
      next: (tasks) => (this.tasks = tasks),
      error: (err) => console.error('Error loading tasks:', err),
    });
  }

  getStatusBadgeClass(status: any): string {
    switch (status) {
      case 'OPEN':
        return 'bg-info';
      case 'IN_PROGRESS':
        return 'bg-warning';
      case 'COMPLETED':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }

  openEditModal(task?: Task, content?: any): void {
    this.isEditMode = !!task;

    if (this.isEditMode && task) {
      this.selectedTask = { ...task };
      this.itemsAsObjects = this.selectedTask.competences.map((c) => ({
        name: c.name,
      }));
    } else {
      this.selectedTask = {
        title: '',
        description: '',
        status: 'OPEN',
        clientId: this.currentUserId,
        budgetType: 'fixed',
        minAmount: 0,
        maxAmount: 0,
        currency: 'USD',
        category: '',
        competences: [],
      };
      this.itemsAsObjects = [];
    }

    this.modalService.open(content, { centered: true }).result.then(
      () => this.resetForm(),
      () => this.resetForm()
    );
  }

  handleTaskSubmit(): void {
    const taskToHandle: Task = {
      ...this.selectedTask,
      competences: this.itemsAsObjects.map((tag) => ({ name: tag.name })),
    };

    if (this.isEditMode) {
      this.updateTask(taskToHandle);
    } else {
      this.createTask(taskToHandle);
    }
  }

  private createTask(newTask: Task): void {
    this.taskService.createTask(newTask).subscribe({
      next: (createdTask) => {
        this.tasks.push(createdTask);
        Swal.fire('Created!', 'Task created successfully.', 'success');
      },
      error: (err) => {
        Swal.fire('Error!', 'Creation failed: ' + err.message, 'error');
      },
    });
  }

  private updateTask(updatedTask: Task): void {
    this.taskService.updateTask(updatedTask.id!, updatedTask).subscribe({
      next: (task) => {
        const index = this.tasks.findIndex((t) => t.id === task.id);
        if (index > -1) {
          this.tasks[index] = task;
        }
        Swal.fire('Updated!', 'Task updated successfully.', 'success');
      },
      error: (err) => {
        Swal.fire('Error!', 'Update failed: ' + err.message, 'error');
      },
    });
  }

  confirmDelete(taskId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteTask(taskId);
      }
    });
  }

  private deleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.tasks = this.tasks.filter((task) => task.id !== taskId);
        Swal.fire('Deleted!', 'Task has been deleted.', 'success');
      },
      error: (err) => {
        Swal.fire('Error!', 'Deletion failed: ' + err.message, 'error');
      },
    });
  }

  private resetForm(): void {
    this.selectedTask = {
      title: '',
      description: '',
      status: 'OPEN',
      clientId: this.currentUserId,
      budgetType: 'fixed',
      minAmount: 0,
      maxAmount: 0,
      currency: 'USD',
      category: '',
      competences: [],
    };
    this.itemsAsObjects = [];
    this.isEditMode = false;
  }
}
