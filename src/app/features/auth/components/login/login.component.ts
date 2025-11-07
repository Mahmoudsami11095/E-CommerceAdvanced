import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthPromoComponent } from '../../../../shared/components/layout/auth-promo/auth-promo.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, AuthPromoComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit() {
    // Check for registration success message
    this.route.queryParams.subscribe(params => {
      if (params['registered'] === 'true') {
        this.successMessage = 'Registration successful! Please sign in with your credentials.';
        // Clear the message after 5 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      }
      if (params['passwordReset'] === 'true') {
        this.successMessage = 'Password reset successful! Please sign in with your new password.';
        // Clear the message after 5 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      }
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password, rememberMe } = this.loginForm.value;

      // Simulate API call
      setTimeout(() => {
        if (this.authService.login(email, password)) {
          if (rememberMe) {
            // Store remember me preference
            localStorage.setItem('rememberMe', 'true');
          }
          // TODO: Navigate to dashboard or home page after implementing it
          // For now, just show success (you can add a success message)
          this.router.navigate(['/auth/login']); // Stay on login for now
        } else {
          this.errorMessage = 'Something went wrong';
          this.isLoading = false;
        }
      }, 1000);
    } else {
      this.loginForm.markAllAsTouched();
      // Show general error message when form is invalid
      if (this.loginForm.get('email')?.invalid || this.loginForm.get('password')?.invalid) {
        this.errorMessage = 'Something went wrong';
      }
    }
  }
}

