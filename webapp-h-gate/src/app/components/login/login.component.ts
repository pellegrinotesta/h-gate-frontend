import { Component, inject, ElementRef, ViewChild } from '@angular/core';
import { ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormBasePageComponent } from '../../shared/components/base/form-base-page.component';
import { RoutesEnum } from '../../shared/enums/routes.enum';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { AuthRequest } from '../../models/auth-request.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends FormBasePageComponent {

  @ViewChild('otpInput') otpInput!: ElementRef;

  private loginService = inject(LoginService);

  loginForm!: FormGroup;
  otpForm!: FormGroup;
  showOtpForm = false;
  hidePassword = true;

  otpError = '';
  maskedEmail = '';
  canResendOtp = false;
  resendTimer = 60;
  private resendInterval: any;


  constructor() {
    super();
  }

  override ngOnInit() {
    super.ngOnInit();
    this.createForm();
  }

  override createForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  onSubmitCredentials() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    const userRequest: AuthRequest = {
      username: this.loginForm.value.email!,
      password: this.loginForm.value.password!
    };

    this.loginService.login(userRequest).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.maskEmail(userRequest.username);
        this.showOtpForm = true;
        this.startResendTimer();

        setTimeout(() => this.otpInput?.nativeElement.focus(), 100);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Login error:', err);
      }
    });
  }

  // onSubmitOtp() {
  //   if (this.otpForm.invalid) return;

  //   this.isLoading = true;
  //   this.otpError = '';

  //   const otpCode = this.otpForm.value.otp;
  //   const email = this.loginForm.value.email!;

  //   this.userService.verifyOtp(email, otpCode).subscribe({
  //     next: (res: { access_token: string }) => {
  //       this.isLoading = false;
  //       localStorage.setItem('adisurc_token', res.access_token);
  //       this.router.navigate([RoutesEnum.STUDENT_DASHBOARD]);
  //     },
  //     error: () => {
  //       this.isLoading = false;
  //       this.otpError = 'Codice OTP non valido. Riprova.';
  //       this.otpForm.reset();
  //       setTimeout(() => this.otpInput?.nativeElement.focus(), 100);
  //     }
  //   });
  // }


  // resendOtp() {
  //   if (!this.canResendOtp) return;

  //   this.isLoading = true;
  //   const req: UserRequest = {
  //     email: this.loginForm.value.email!,
  //     password: this.loginForm.value.password!
  //   };

  //   this.userService.login(req).subscribe({
  //     next: () => {
  //       this.isLoading = false;
  //       this.otpForm.reset();
  //       this.otpError = '';
  //       this.startResendTimer();
  //       setTimeout(() => this.otpInput?.nativeElement.focus(), 100);
  //     },
  //     error: () => {
  //       this.isLoading = false;
  //       this.otpError = 'Errore nell\'invio del codice. Riprova.';
  //     }
  //   });
  // }

  backToLogin() {
    this.showOtpForm = false;
    this.otpForm.reset();
    this.otpError = '';
    this.clearResendTimer();
  }

  private maskEmail(email: string) {
    const [username, domain] = email.split('@');
    const masked = username.length > 2
      ? username[0] + '*'.repeat(username.length - 2) + username[username.length - 1]
      : username;
    this.maskedEmail = `${masked}@${domain}`;
  }

  private startResendTimer() {
    this.canResendOtp = false;
    this.resendTimer = 60;
    this.resendInterval = setInterval(() => {
      this.resendTimer--;
      if (this.resendTimer <= 0) {
        this.canResendOtp = true;
        this.clearResendTimer();
      }
    }, 1000);
  }

  private clearResendTimer() {
    if (this.resendInterval) {
      clearInterval(this.resendInterval);
      this.resendInterval = null;
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.clearResendTimer();
  }
}
