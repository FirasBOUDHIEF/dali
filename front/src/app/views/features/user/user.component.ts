import { CommonModule, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { FeatherIconDirective } from '../../../core/feather-icon/feather-icon.directive';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, NgIf, FormsModule, FeatherIconDirective],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  freelancers: any[] = [];
  filteredFreelancers: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadFreelancers();
  }
  filterFreelancers(): void {
    if (!this.searchTerm) {
      this.filteredFreelancers = [...this.freelancers];
      return;
    }

    const searchText = this.searchTerm.toLowerCase().trim();
    this.filteredFreelancers = this.freelancers.filter(
      (f) =>
        f.username.toLowerCase().includes(searchText) ||
        f.email.toLowerCase().includes(searchText) ||
        (f.firstName && f.firstName.toLowerCase().includes(searchText)) ||
        (f.lastName && f.lastName.toLowerCase().includes(searchText)) ||
        f.account_type.toLowerCase().includes(searchText)
    );
  }
  searchTerm: string = '';
  loadFreelancers(): void {
    this.http.get<any[]>('http://localhost:8082/api/user').subscribe({
      next: (data) => {
        this.freelancers = data;
        this.filteredFreelancers = [...this.freelancers];
      },
      error: (err) => console.error('Error loading freelancers:', err),
    });
  }
  confirmDelete(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteFreelancer(id);
      }
    });
  }

  private deleteFreelancer(id: number): void {
    this.http.delete(`http://localhost:8082/api/user/${id}`).subscribe({
      next: () => {
        this.freelancers = this.freelancers.filter((f) => f.id !== id);
        Swal.fire('Deleted!', 'Freelancer has been deleted.', 'success');
      },
      error: (err) => {
        Swal.fire('Error!', 'Deletion failed: ' + err.message, 'error');
      },
    });
  }
}
