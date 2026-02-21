import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import {
  DashboardService,
  DashboardStats,
} from "../../services/dashboard.service";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-600 mt-2">
          Welcome back! Here's an overview of your rental portal.
        </p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="card p-6">
          <div class="flex items-center justify-between mb-4">
            <div
              class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
            >
              <span class="material-icons text-blue-600">home</span>
            </div>
            <span class="text-2xl font-bold text-gray-900">{{
              stats?.total_units || 0
            }}</span>
          </div>
          <h3 class="text-gray-600 text-sm font-medium">Total Units</h3>
        </div>

        <div class="card p-6">
          <div class="flex items-center justify-between mb-4">
            <div
              class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"
            >
              <span class="material-icons text-green-600">check_circle</span>
            </div>
            <span class="text-2xl font-bold text-gray-900">{{
              stats?.occupied_units || 0
            }}</span>
          </div>
          <h3 class="text-gray-600 text-sm font-medium">Occupied Units</h3>
        </div>

        <div class="card p-6">
          <div class="flex items-center justify-between mb-4">
            <div
              class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center"
            >
              <span class="material-icons text-yellow-600">people</span>
            </div>
            <span class="text-2xl font-bold text-gray-900">{{
              stats?.total_tenants || 0
            }}</span>
          </div>
          <h3 class="text-gray-600 text-sm font-medium">Active Tenants</h3>
        </div>

        <div class="card p-6">
          <div class="flex items-center justify-between mb-4">
            <div
              class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"
            >
              <span class="material-icons text-purple-600"
                >pending_actions</span
              >
            </div>
            <span class="text-2xl font-bold text-gray-900">{{
              stats?.pending_bookings || 0
            }}</span>
          </div>
          <h3 class="text-gray-600 text-sm font-medium">Pending Bookings</h3>
        </div>
      </div>

      <!-- Additional Stats -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Occupancy Overview
          </h3>
          <div class="space-y-4">
            <div>
              <div class="flex justify-between mb-2">
                <span class="text-gray-600">Occupancy Rate</span>
                <span class="font-semibold text-gray-900"
                  >{{ stats?.occupancy_rate || 0 }}%</span
                >
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-primary-600 h-2 rounded-full transition-all duration-500"
                  [style.width.%]="stats?.occupancy_rate || 0"
                ></div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p class="text-2xl font-bold text-green-600">
                  {{ stats?.occupied_units || 0 }}
                </p>
                <p class="text-sm text-gray-600">Occupied</p>
              </div>
              <div>
                <p class="text-2xl font-bold text-blue-600">
                  {{ stats?.available_units || 0 }}
                </p>
                <p class="text-sm text-gray-600">Available</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Revenue Overview
          </h3>
          <div class="space-y-4">
            <div>
              <p class="text-sm text-gray-600">Total Revenue (Mock Data)</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">
                \${{ formatNumber(stats?.total_revenue || 0) }}
              </p>
            </div>
            <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p class="text-sm text-gray-600">This Month</p>
                <p class="text-xl font-semibold text-gray-900">
                  \${{ formatNumber((stats?.total_revenue || 0) / 3) }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Average/Unit</p>
                <p class="text-xl font-semibold text-gray-900">
                  \${{
                    formatNumber(
                      (stats?.total_revenue || 0) / (stats?.occupied_units || 1)
                    )
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Recent Bookings</h3>
            <a
              routerLink="/bookings"
              class="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >View All</a
            >
          </div>
          <div *ngIf="loadingBookings" class="text-center py-8">
            <div
              class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"
            ></div>
          </div>
          <div *ngIf="!loadingBookings" class="space-y-4">
            <div
              *ngFor="let booking of recentBookings"
              class="flex items-center justify-between py-3 border-b border-gray-200 last:border-0"
            >
              <div class="flex-1">
                <p class="font-medium text-gray-900">
                  {{ booking.amenity_name }}
                </p>
                <p class="text-sm text-gray-600">{{ booking.user_name }}</p>
              </div>
              <span
                class="badge"
                [ngClass]="{
                  'badge-success': booking.status === 'approved',
                  'badge-warning': booking.status === 'pending',
                  'badge-danger': booking.status === 'declined'
                }"
              >
                {{ booking.status }}
              </span>
            </div>
            <div
              *ngIf="recentBookings.length === 0"
              class="text-center py-8 text-gray-500"
            >
              No recent bookings
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <button
              routerLink="/units"
              class="p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition text-left"
            >
              <span class="material-icons text-primary-600 mb-2">add_home</span>
              <p class="font-semibold text-gray-900 text-sm">Add Unit</p>
            </button>
            <button
              routerLink="/towers"
              class="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition text-left"
            >
              <span class="material-icons text-green-600 mb-2"
                >location_city</span
              >
              <p class="font-semibold text-gray-900 text-sm">Add Tower</p>
            </button>
            <button
              routerLink="/amenities"
              class="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition text-left"
            >
              <span class="material-icons text-purple-600 mb-2">pool</span>
              <p class="font-semibold text-gray-900 text-sm">
                Manage Amenities
              </p>
            </button>
            <button
              routerLink="/bookings"
              class="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition text-left"
            >
              <span class="material-icons text-yellow-600 mb-2">approval</span>
              <p class="font-semibold text-gray-900 text-sm">
                Approve Bookings
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  recentBookings: any[] = [];
  loadingBookings = true;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadStats();
    this.loadRecentBookings();
  }

  loadStats() {
    this.dashboardService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error("Error loading stats:", error);
      },
    });
  }

  loadRecentBookings() {
    this.dashboardService.getBookings().subscribe({
      next: (bookings) => {
        this.recentBookings = bookings.slice(0, 5);
        this.loadingBookings = false;
      },
      error: (error) => {
        console.error("Error loading bookings:", error);
        this.loadingBookings = false;
      },
    });
  }

  formatNumber(num: number): string {
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }
}
