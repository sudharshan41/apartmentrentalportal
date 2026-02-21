import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="w-64 fixed bg-gray-900 text-white min-h-screen flex flex-col">
      <div class="p-6 border-b border-gray-800">
        <div class="flex items-center">
          <span class="material-icons text-primary-400 text-3xl mr-2"
            >apartment</span
          >
          <span class="text-xl font-bold">Admin Portal</span>
        </div>
      </div>

      <nav class="flex-1 py-6">
        <a
          routerLink="/dashboard"
          routerLinkActive="bg-primary-600"
          class="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition"
        >
          <span class="material-icons mr-3">dashboard</span>
          <span>Dashboard</span>
        </a>

        <a
          routerLink="/towers"
          routerLinkActive="bg-primary-600"
          class="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition"
        >
          <span class="material-icons mr-3">location_city</span>
          <span>Towers</span>
        </a>

        <a
          routerLink="/units"
          routerLinkActive="bg-primary-600"
          class="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition"
        >
          <span class="material-icons mr-3">home</span>
          <span>Units</span>
        </a>

        <a
          routerLink="/amenities"
          routerLinkActive="bg-primary-600"
          class="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition"
        >
          <span class="material-icons mr-3">pool</span>
          <span>Amenities</span>
        </a>

        <a
          routerLink="/bookings"
          routerLinkActive="bg-primary-600"
          class="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition"
        >
          <span class="material-icons mr-3">event</span>
          <span>Bookings</span>
        </a>

        <a
          routerLink="/tenants"
          routerLinkActive="bg-primary-600"
          class="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition"
        >
          <span class="material-icons mr-3">people</span>
          <span>Tenants</span>
        </a>
      </nav>

      <div class="p-6 border-t border-gray-800">
        <div class="flex items-center mb-4">
          <span class="material-icons text-gray-400 mr-2">account_circle</span>
          <div class="flex-1">
            <p class="text-sm font-medium">{{ currentUser?.full_name }}</p>
            <p class="text-xs text-gray-400">{{ currentUser?.email }}</p>
          </div>
        </div>
        <button
          (click)="logout()"
          class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center"
        >
          <span class="material-icons text-sm mr-2">logout</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  `,
})
export class SidebarComponent {
  currentUser: any;

  constructor(private authService: AuthService, private router: Router) {
    this.currentUser = this.authService.getCurrentUser();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}
