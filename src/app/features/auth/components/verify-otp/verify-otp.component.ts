import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthPromoComponent } from '../../../../shared/components/layout/auth-promo/auth-promo.component';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, AuthPromoComponent],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.css'
})
export class VerifyOtpComponent implements OnInit, OnDestroy {
  otpForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  email = 'user@example.com';
  timer = 60;
  timerInterval: any;
  canResend = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Create form with 6 OTP fields
    this.otpForm = this.fb.group({
      otp1: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      otp2: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      otp3: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      otp4: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      otp5: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      otp6: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]]
    });
  }

  ngOnInit() {
    // Get email from query params if available
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.email = params['email'];
      }
    });

    // Start timer
    this.startTimer();
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  startTimer() {
    this.timer = 60;
    this.canResend = false;
    this.timerInterval = setInterval(() => {
      this.timer--;
      if (this.timer <= 0) {
        clearInterval(this.timerInterval);
        this.canResend = true;
      }
    }, 1000);
  }

  getOtpValue(): string {
    const values = [
      this.otpForm.get('otp1')?.value,
      this.otpForm.get('otp2')?.value,
      this.otpForm.get('otp3')?.value,
      this.otpForm.get('otp4')?.value,
      this.otpForm.get('otp5')?.value,
      this.otpForm.get('otp6')?.value
    ];
    return values.join('');
  }

  onInput(event: any, currentIndex: number) {
    const input = event.target;
    const value = input.value;

    // Only allow single digit
    if (value.length > 1) {
      input.value = value.charAt(0);
      this.otpForm.get(`otp${currentIndex + 1}`)?.setValue(value.charAt(0));
    }

    // Move to next input if value is entered
    if (value && currentIndex < 5) {
      const nextInput = document.getElementById(`otp${currentIndex + 2}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  onKeyDown(event: KeyboardEvent, currentIndex: number) {
    // Handle backspace
    const target = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && target && !target.value && currentIndex > 0) {
      const prevInput = document.getElementById(`otp${currentIndex}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text').trim();
    
    if (pastedData && /^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      digits.forEach((digit, index) => {
        if (index < 6) {
          this.otpForm.get(`otp${index + 1}`)?.setValue(digit);
        }
      });
      // Focus last input
      const lastInput = document.getElementById('otp6');
      if (lastInput) {
        lastInput.focus();
      }
    }
  }

  resendCode() {
    if (this.canResend) {
      // Simulate resending code
      this.startTimer();
      // In real implementation, call API to resend OTP
    }
  }

  editEmail() {
    // Navigate back to forgot password page
    this.router.navigate(['/auth/forgot-password'], { queryParams: { email: this.email } });
  }

  onSubmit() {
    if (this.otpForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const otpCode = this.getOtpValue();

      // Simulate API call
      setTimeout(() => {
        // In real implementation, verify OTP with backend
        if (otpCode === '123456') {
          // Navigate to reset password page
          this.router.navigate(['/auth/reset-password'], { queryParams: { email: this.email } });
        } else {
          this.errorMessage = 'Invalid OTP code. Please try again.';
          this.isLoading = false;
          // Clear form
          this.otpForm.reset();
        }
      }, 1000);
    } else {
      this.otpForm.markAllAsTouched();
    }
  }

  goBack() {
    this.router.navigate(['/auth/forgot-password']);
  }
}

