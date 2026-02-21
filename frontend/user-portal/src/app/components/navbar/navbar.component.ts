import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService, User } from "../../services/auth.service";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-white shadow-lg sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <a routerLink="/" class="flex items-center">
              <span class="material-icons text-primary-600 text-3xl mr-2"
                >apartment</span
              >
              <span class="text-2xl font-bold text-gray-900"
                >Rental<span class="text-primary-600">Portal</span></span
              >
            </a>
            <div class="hidden md:ml-10 md:flex md:space-x-8">
              <a
                routerLink="/"
                routerLinkActive="text-primary-600"
                [routerLinkActiveOptions]="{ exact: true }"
                class="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition"
              >
                Home
              </a>
              <a
                routerLink="/flats"
                routerLinkActive="text-primary-600"
                class="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition"
              >
                Browse Flats
              </a>
              <a
                routerLink="/amenities"
                routerLinkActive="text-primary-600"
                class="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition"
              >
                Amenities
              </a>
              <a
                *ngIf="currentUser"
                routerLink="/bookings"
                routerLinkActive="text-primary-600"
                class="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition"
              >
                My Bookings
              </a>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div
              *ngIf="!currentUser"
              class="hidden md:flex items-center space-x-4"
            >
              <a
                routerLink="/login"
                class="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition"
              >
                Login
              </a>
              <a routerLink="/register" class="btn-primary"> Sign Up </a>
            </div>
            <div *ngIf="currentUser" class="flex items-center space-x-4">
              <div class="flex items-center space-x-2">
                <span class="material-icons text-gray-600">account_circle</span>
                <span
                  class="text-sm font-medium text-gray-700 hidden md:block"
                  >{{ currentUser.full_name }}</span
                >
              </div>
              <button
                (click)="logout()"
                class="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium transition"
              >
                Logout
              </button>
            </div>
            <button
              (click)="toggleMobileMenu()"
              class="md:hidden text-gray-700"
            >
              <span class="material-icons">menu</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div
        *ngIf="mobileMenuOpen"
        class="md:hidden bg-white border-t border-gray-200"
      >
        <div class="px-2 pt-2 pb-3 space-y-1">
          <a
            routerLink="/"
            (click)="toggleMobileMenu()"
            class="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Home
          </a>
          <a
            routerLink="/flats"
            (click)="toggleMobileMenu()"
            class="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Browse Flats
          </a>
          <a
            routerLink="/amenities"
            (click)="toggleMobileMenu()"
            class="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Amenities
          </a>
          <a
            *ngIf="currentUser"
            routerLink="/bookings"
            (click)="toggleMobileMenu()"
            class="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            My Bookings
          </a>
          <div
            *ngIf="!currentUser"
            class="space-y-2 pt-2 border-t border-gray-200"
          >
            <a
              routerLink="/login"
              (click)="toggleMobileMenu()"
              class="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Login
            </a>
            <a
              routerLink="/register"
              (click)="toggleMobileMenu()"
              class="block px-3 py-2 bg-primary-600 text-white rounded-md"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </nav>
  `,
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;
  mobileMenuOpen = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/"]);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}
