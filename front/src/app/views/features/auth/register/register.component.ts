import { CommonModule, NgStyle } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthServiceService } from '../login/auth-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NgStyle, RouterLink, FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  role: string = 'ROLE_FREELANCER'; // Default role
  username: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  onRegister(event: Event) {
    event.preventDefault();

    const registrationData = {
      role: this.role,
      email: this.email,
      username: this.username,
      password: this.password,
    };
    console.log(registrationData);

    // Clear error message before making the request
    this.errorMessage = '';

    this.authService.register(registrationData).subscribe(
      (response: any) => {
        console.log('User registered successfully:', response);
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          title: 'Signup successfully',
          icon: 'success',
        });
        this.router.navigate(['/auth/login']); // Redirect to login page after successful registration
      },
      (error) => {
        this.errorMessage = 'Registration failed. Please try again.';
        console.error(error);
      }
    );
  }
}
