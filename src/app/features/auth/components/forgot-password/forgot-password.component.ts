import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthPromoComponent } from '../../../../shared/components/layout/auth-promo/auth-promo.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, AuthPromoComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isLoading = false;
  isEmailSent = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get email() {
    return this.forgotPasswordForm.get('email');
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email } = this.forgotPasswordForm.value;

      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        // Navigate to verify OTP page with email
        this.router.navigate(['/auth/verify-otp'], { queryParams: { email } });
      }, 1500);
    } else {
      this.forgotPasswordForm.markAllAsTouched();
    }
  }

  backToLogin() {
    this.router.navigate(['/auth/login']);
  }
}

