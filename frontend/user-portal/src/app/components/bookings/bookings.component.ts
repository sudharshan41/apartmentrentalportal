import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BookingService, Booking } from "../../services/booking.service";

@Component({
  selector: "app-bookings",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-gray-50 min-h-screen">
      <!-- Page Header -->
      <div
        class="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 class="text-4xl font-bold mb-2">My Bookings</h1>
          <p class="text-xl text-primary-100">
            Track your amenity booking requests
          </p>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Loading State -->
        <div *ngIf="loading" class="text-center py-12">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"
          ></div>
          <p class="mt-4 text-gray-600">Loading bookings...</p>
        </div>

        <!-- Bookings List -->
        <div *ngIf="!loading && bookings.length > 0" class="space-y-4">
          <div
            *ngFor="let booking of bookings"
            class="card p-6 hover:shadow-xl transition-shadow"
          >
            <div
              class="flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div class="flex-1">
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <h3 class="text-xl font-bold text-gray-900 mb-1">
                      {{ booking.amenity_name }}
                    </h3>
                    <div class="flex items-center text-gray-600 text-sm">
                      <span class="material-icons text-sm mr-1"
                        >calendar_today</span
                      >
                      <span>{{ formatDate(booking.booking_date) }}</span>
                    </div>
                  </div>
                  <span
                    class="badge ml-4"
                    [ngClass]="{
                      'badge-success': booking.status === 'approved',
                      'badge-warning': booking.status === 'pending',
                      'badge-danger':
                        booking.status === 'declined' ||
                        booking.status === 'cancelled'
                    }"
                  >
                    {{ booking.status }}
                  </span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div class="flex items-center text-gray-700">
                    <span class="material-icons text-primary-600 mr-2"
                      >schedule</span
                    >
                    <span
                      >{{ formatTime(booking.start_time) }} -
                      {{ formatTime(booking.end_time) }}</span
                    >
                  </div>
                  <div class="flex items-center text-gray-700">
                    <span class="material-icons text-primary-600 mr-2"
                      >confirmation_number</span
                    >
                    <span>Booking #{{ booking.id }}</span>
                  </div>
                </div>

                <div
                  *ngIf="booking.notes"
                  class="bg-gray-50 p-3 rounded-lg mb-4"
                >
                  <p class="text-sm text-gray-600">
                    <span class="font-semibold">Your Notes:</span>
                    {{ booking.notes }}
                  </p>
                </div>

                <div
                  *ngIf="booking.admin_notes"
                  class="bg-blue-50 p-3 rounded-lg"
                >
                  <p class="text-sm text-blue-800">
                    <span class="font-semibold">Admin Notes:</span>
                    {{ booking.admin_notes }}
                  </p>
                </div>
              </div>

              <div class="mt-4 md:mt-0 md:ml-6 flex md:flex-col gap-2">
                <button
                  *ngIf="booking.status === 'pending'"
                  (click)="cancelBooking(booking.id!)"
                  class="btn-danger text-sm"
                >
                  <span class="flex items-center">
                    <span class="material-icons text-sm mr-1">cancel</span>
                    Cancel
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          *ngIf="!loading && bookings.length === 0"
          class="text-center py-12"
        >
          <span class="material-icons text-gray-400 text-6xl mb-4"
            >event_busy</span
          >
          <h3 class="text-xl font-semibold text-gray-700 mb-2">
            No bookings yet
          </h3>
          <p class="text-gray-600 mb-6">
            Start booking amenities to see them here
          </p>
          <a routerLink="/amenities" class="btn-primary inline-block">
            Browse Amenities
          </a>
        </div>
      </div>
    </div>
  `,
})
export class BookingsComponent implements OnInit {
  bookings: Booking[] = [];
  loading = true;

  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.bookingService.getBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.loading = false;
      },
      error: (error) => {
        console.error("Error loading bookings:", error);
        this.loading = false;
      },
    });
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  formatTime(timeStr: string): string {
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  }

  cancelBooking(id: number) {
    if (confirm("Are you sure you want to cancel this booking?")) {
      this.bookingService.deleteBooking(id).subscribe({
        next: () => {
          this.loadBookings();
        },
        error: (error) => {
          console.error("Error cancelling booking:", error);
          alert("Failed to cancel booking. Please try again.");
        },
      });
    }
  }
}
