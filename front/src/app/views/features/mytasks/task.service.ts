import { Injectable } from '@angular/core';
import { Task } from './models';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private baseUrl = 'http://localhost:8084/api/tasks';

  constructor(private http: HttpClient) {}

  // Create a new task
  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, task);
  }

  // Get all tasks for a client
  getTasksByClientId(clientId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/client/${clientId}`);
  }

  // Get all tasks for a freelancer
  getTasksByFreelancerId(freelancerId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/freelancer/${freelancerId}`);
  }

  // Get single task by ID
  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/${id}`);
  }

  // Update a task
  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/${id}`, task);
  }

  // Delete a task
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Get all tasks (if needed)
  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.baseUrl);
  }
  markTaskAsComplete(id: number) {
    return this.http.put(`${this.baseUrl}/${id}/status`, {});
  }
}
