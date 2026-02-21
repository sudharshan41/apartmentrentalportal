import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DashboardService } from "../../services/dashboard.service";

@Component({
  selector: "app-bookings",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Booking Requests</h1>

      <div *ngIf="loading" class="text-center py-12">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"
        ></div>
      </div>

      <div
        *ngIf="error && !loading"
        class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
      >
        {{ error }}
      </div>

      <div *ngIf="!loading && !error" class="space-y-4">
        <div
          *ngIf="bookings.length === 0"
          class="text-center py-12 bg-white rounded-lg shadow"
        >
          <span class="material-icons text-gray-400 text-6xl mb-4"
            >event_busy</span
          >
          <p class="text-gray-600 text-lg">No booking requests found</p>
        </div>

        <div *ngFor="let booking of bookings" class="card p-6">
          <div
            class="flex flex-col md:flex-row md:items-center md:justify-between"
          >
            <div class="flex-1">
              <h3 class="text-xl font-bold text-gray-900 mb-2">
                {{ booking.amenity_name }}
              </h3>
              <div class="space-y-1 text-sm text-gray-600">
                <p>
                  <span class="font-semibold">User:</span>
                  {{ booking.user_name }} ({{ booking.user_email }})
                </p>
                <p>
                  <span class="font-semibold">Date:</span>
                  {{ booking.booking_date }}
                </p>
                <p>
                  <span class="font-semibold">Time:</span>
                  {{ booking.start_time }} - {{ booking.end_time }}
                </p>
                <p *ngIf="booking.notes">
                  <span class="font-semibold">Notes:</span> {{ booking.notes }}
                </p>
              </div>
            </div>
            <div class="mt-4 md:mt-0 md:ml-6">
              <span
                class="badge mb-4 block"
                [ngClass]="{
                  'badge-success': booking.status === 'approved',
                  'badge-warning': booking.status === 'pending',
                  'badge-danger': booking.status === 'declined'
                }"
              >
                {{ booking.status }}
              </span>
              <div *ngIf="booking.status === 'pending'" class="flex gap-2">
                <button
                  (click)="updateStatus(booking.id, 'approved')"
                  class="btn-success text-sm"
                >
                  Approve
                </button>
                <button
                  (click)="updateStatus(booking.id, 'declined')"
                  class="btn-danger text-sm"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class BookingsComponent implements OnInit {
  bookings: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.loading = true;
    this.error = null;
    this.dashboardService.getBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.loading = false;
      },
      error: (error) => {
        console.error("Error loading bookings:", error);
        this.error = error.error?.error || "Failed to load bookings";
        this.loading = false;
      },
    });
  }

  updateStatus(id: number, status: string) {
    this.dashboardService.updateBookingStatus(id, status).subscribe({
      next: () => this.loadBookings(),
      error: (error) => console.error("Error:", error),
    });
  }
}
