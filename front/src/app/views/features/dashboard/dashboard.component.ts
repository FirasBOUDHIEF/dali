import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NgbCalendar,
  NgbDatepickerModule,
  NgbDateStruct,
  NgbDropdownModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { FeatherIconDirective } from '../../../core/feather-icon/feather-icon.directive';
import {
  ThemeCssVariableService,
  ThemeCssVariablesType,
} from '../../../core/services/theme-css-variable.service';
import { UserService } from '../user/user.service';
import { TaskService } from '../mytasks/task.service';
import { CandidatureService } from '../candidature.service';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
// Add these interfaces
interface DashboardStats {
  totalFreelancers: number;
  totalClients: number;
  totalTasks: number;
  pendingCandidatures: number;
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NgbDropdownModule,
    FormsModule,
    NgbDatepickerModule,
    NgApexchartsModule,
    FeatherIconDirective,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  statsCards: any[] = [];
  recentTasks: any[] = [];
  pendingApplications: any[] = [];
  tasksChartOptions: ApexOptions = {};

  currentDate: NgbDateStruct = inject(NgbCalendar).getToday();
  constructor(
    private userService: UserService,
    private taskService: TaskService,
    private candidatureService: CandidatureService,
    private router: Router
  ) {}
  role;
  ngOnInit(): void {
    this.loadData();

    this.role = localStorage.getItem('role');
    if (this.role == 'ROLE_ADMIN') {
      this.router.navigate(['/dashboard']);
    } else if (this.role == 'ROLE_CLIENT') {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  private loadData(): void {
    forkJoin({
      freelancers: this.userService.getAllFreelancers(),
      clients: this.userService.getAllClients(),
      tasks: this.taskService.getAllTasks(),
      candidatures: this.candidatureService.getAllCandidatures(),
    }).subscribe({
      next: ({ freelancers, clients, tasks, candidatures }) => {
        this.initializeStats(freelancers, clients, tasks, candidatures);
        this.initializeRecentTasks(tasks);
        this.initializePendingApplications(candidatures);
        this.initializeCharts(tasks);
      },
      error: (err) => console.error('Error loading dashboard data:', err),
    });
  }

  private initializeStats(
    freelancers: any[],
    clients: any[],
    tasks: any[],
    candidatures: any[]
  ): void {
    this.statsCards = [
      { title: 'Freelancers', value: freelancers.length, icon: 'users' },
      { title: 'Clients', value: clients.length, icon: 'briefcase' },
      { title: 'Total Tasks', value: tasks.length, icon: 'file-text' },
      {
        title: 'Pending Applications',
        value: candidatures.filter((c) => !c.confirmed).length,
        icon: 'clock',
      },
    ];
  }

  private initializeRecentTasks(tasks: any[]): void {
    this.recentTasks = tasks
      .slice(-5)
      .reverse()
      .map((task) => ({
        ...task,
        statusBadge: this.getStatusBadge(task.status),
      }));
  }

  private initializePendingApplications(candidatures: any[]): void {
    this.pendingApplications = candidatures
      .filter((c) => !c.confirmed)
      .slice(-5);
  }

  private initializeCharts(tasks: any[]): void {
    const taskCounts = this.groupTasksByDate(tasks);

    this.tasksChartOptions = {
      series: [
        {
          name: 'Tasks Created',
          data: Object.values(taskCounts),
        },
      ],
      chart: {
        type: 'area',
        height: 350,
        toolbar: { show: false },
      },
      colors: ['#3b82f6'],
      xaxis: {
        type: 'datetime',
        categories: Object.keys(taskCounts),
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth' },
    };
  }

  private groupTasksByDate(tasks: any[]): { [date: string]: number } {
    return tasks.reduce((acc, task) => {
      const date = new Date(task.createdAt).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
  }

  private getStatusBadge(status: string): string {
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
}
