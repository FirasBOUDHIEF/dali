import { CommonModule, NgStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthServiceService } from './auth-service.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgStyle, RouterLink, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginData = { username: '', password: '' };
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {}

  onLoggedin(e: Event) {
    this.authService
      .login(this.loginData.username, this.loginData.password)
      .subscribe(
        (response: any) => {
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('userId', response.user.id);
          localStorage.setItem('userName', response.user.username);
          localStorage.setItem('email', response.user.email);
          localStorage.setItem('role', response.user.role);
          localStorage.setItem('completed', response.user.completed);
          localStorage.setItem('imageFilename', response.user.imageFilename);
          if (response.user.completed) {
            this.router.navigate(['/dashboard']); // Redirect to a secure page
          } else {
            this.router.navigate(['/start']); // Redirect to a secure page
          }
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            title: 'Signed in successfully',
            icon: 'success',
          });
        },
        (error) => {
          this.errorMessage = 'Invalid username or password!';
        }
      );
  }
}
