import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div
      class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-md w-full">
        <div class="card p-8">
          <div class="text-center mb-8">
            <span class="material-icons text-primary-600 text-5xl"
              >person_add</span
            >
            <h2 class="mt-4 text-3xl font-bold text-gray-900">
              Create Account
            </h2>
            <p class="mt-2 text-gray-600">Join our community today</p>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Full Name</label
                >
                <input
                  type="text"
                  formControlName="full_name"
                  class="input-field"
                  placeholder="Enter your full name"
                  [class.border-red-500]="
                    registerForm.get('full_name')?.invalid &&
                    registerForm.get('full_name')?.touched
                  "
                />
                <div
                  *ngIf="
                    registerForm.get('full_name')?.invalid &&
                    registerForm.get('full_name')?.touched
                  "
                  class="text-red-500 text-sm mt-1"
                >
                  Full name is required
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Email Address</label
                >
                <input
                  type="email"
                  formControlName="email"
                  class="input-field"
                  placeholder="Enter your email"
                  [class.border-red-500]="
                    registerForm.get('email')?.invalid &&
                    registerForm.get('email')?.touched
                  "
                />
                <div
                  *ngIf="
                    registerForm.get('email')?.invalid &&
                    registerForm.get('email')?.touched
                  "
                  class="text-red-500 text-sm mt-1"
                >
                  Valid email is required
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Phone Number</label
                >
                <input
                  type="tel"
                  formControlName="phone"
                  class="input-field"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Password</label
                >
                <input
                  type="password"
                  formControlName="password"
                  class="input-field"
                  placeholder="Create a password"
                  [class.border-red-500]="
                    registerForm.get('password')?.invalid &&
                    registerForm.get('password')?.touched
                  "
                />
                <div
                  *ngIf="
                    registerForm.get('password')?.invalid &&
                    registerForm.get('password')?.touched
                  "
                  class="text-red-500 text-sm mt-1"
                >
                  Password must be at least 6 characters
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Confirm Password</label
                >
                <input
                  type="password"
                  formControlName="confirmPassword"
                  class="input-field"
                  placeholder="Confirm your password"
                  [class.border-red-500]="passwordMismatch()"
                />
                <div
                  *ngIf="passwordMismatch()"
                  class="text-red-500 text-sm mt-1"
                >
                  Passwords do not match
                </div>
              </div>

              <div
                *ngIf="errorMessage"
                class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
              >
                {{ errorMessage }}
              </div>

              <div
                *ngIf="successMessage"
                class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg"
              >
                {{ successMessage }}
              </div>

              <button
                type="submit"
                [disabled]="
                  registerForm.invalid || passwordMismatch() || loading
                "
                class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span *ngIf="!loading">Create Account</span>
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
                  Creating account...
                </span>
              </button>
            </div>
          </form>

          <div class="mt-6 text-center">
            <p class="text-gray-600">
              Already have an account?
              <a
                routerLink="/login"
                class="text-primary-600 hover:text-primary-700 font-semibold"
                >Sign in</a
              >
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  errorMessage = "";
  successMessage = "";

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      full_name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phone: [""],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", Validators.required],
    });
  }

  passwordMismatch(): boolean {
    const password = this.registerForm.get("password");
    const confirmPassword = this.registerForm.get("confirmPassword");
    return !!(
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value &&
      confirmPassword.touched
    );
  }

  onSubmit() {
    if (this.registerForm.valid && !this.passwordMismatch()) {
      this.loading = true;
      this.errorMessage = "";
      this.successMessage = "";

      const { full_name, email, phone, password } = this.registerForm.value;

      this.authService
        .register({ full_name, email, phone, password })
        .subscribe({
          next: (response) => {
            this.loading = false;
            this.successMessage =
              "Account created successfully! Redirecting to login...";
            setTimeout(() => {
              this.router.navigate(["/login"]);
            }, 2000);
          },
          error: (error) => {
            this.loading = false;
            this.errorMessage =
              error.error?.error || "Registration failed. Please try again.";
          },
        });
    }
  }
}
