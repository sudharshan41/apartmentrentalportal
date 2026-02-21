import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div
      class="min-h-screen bg-gradient-to-br from-primary-600 to-primary-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-md w-full">
        <div class="card p-8">
          <div class="text-center mb-8">
            <span class="material-icons text-primary-600 text-5xl"
              >admin_panel_settings</span
            >
            <h2 class="mt-4 text-3xl font-bold text-gray-900">Admin Portal</h2>
            <p class="mt-2 text-gray-600">Sign in to manage your properties</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Email Address</label
                >
                <input
                  type="email"
                  formControlName="email"
                  class="input-field"
                  placeholder="Enter admin email"
                  [class.border-red-500]="
                    loginForm.get('email')?.invalid &&
                    loginForm.get('email')?.touched
                  "
                />
                <div
                  *ngIf="
                    loginForm.get('email')?.invalid &&
                    loginForm.get('email')?.touched
                  "
                  class="text-red-500 text-sm mt-1"
                >
                  Valid email is required
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Password</label
                >
                <input
                  type="password"
                  formControlName="password"
                  class="input-field"
                  placeholder="Enter password"
                  [class.border-red-500]="
                    loginForm.get('password')?.invalid &&
                    loginForm.get('password')?.touched
                  "
                />
                <div
                  *ngIf="
                    loginForm.get('password')?.invalid &&
                    loginForm.get('password')?.touched
                  "
                  class="text-red-500 text-sm mt-1"
                >
                  Password is required
                </div>
              </div>

              <div
                *ngIf="errorMessage"
                class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
              >
                {{ errorMessage }}
              </div>

              <button
                type="submit"
                [disabled]="loginForm.invalid || loading"
                class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span *ngIf="!loading">Sign In</span>
                <span *ngIf="loading" class="flex items-center justify-center">
                  <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                      fill="none"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              </button>
            </div>
          </form>

          <div class="mt-6 pt-6 border-t border-gray-200">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p class="text-sm font-semibold text-blue-900 mb-1">
                Demo Admin Login:
              </p>
              <p class="text-sm text-blue-800">
                admin&#64;rental.com / admin123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = "";

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = "";

      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (response) => {
          if (response.user.role !== "admin") {
            this.loading = false;
            this.errorMessage = "Access denied. Admin privileges required.";
            this.authService.logout();
            return;
          }
          this.loading = false;
          this.router.navigate(["/dashboard"]);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage =
            error.error?.error || "Login failed. Please try again.";
        },
      });
    }
  }
}
