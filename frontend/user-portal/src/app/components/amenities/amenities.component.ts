import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AmenityService, Amenity } from "../../services/amenity.service";
import { BookingService, Booking } from "../../services/booking.service";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-amenities",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-gray-50 min-h-screen">
      <!-- Page Header -->
      <div
        class="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 class="text-4xl font-bold mb-2">Our Amenities</h1>
          <p class="text-xl text-primary-100">
            Enjoy world-class facilities for a comfortable lifestyle
          </p>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Loading State -->
        <div *ngIf="loading" class="text-center py-12">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"
          ></div>
          <p class="mt-4 text-gray-600">Loading amenities...</p>
        </div>

        <!-- Amenities Grid -->
        <div
          *ngIf="!loading"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <div *ngFor="let amenity of amenities" class="card group">
            <div class="relative overflow-hidden h-56">
              <img
                [src]="amenity.image_url"
                [alt]="amenity.name"
                class="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div class="absolute top-4 right-4">
                <span
                  class="badge"
                  [ngClass]="{
                    'badge-success': amenity.available,
                    'badge-danger': !amenity.available
                  }"
                >
                  {{ amenity.available ? "Available" : "Unavailable" }}
                </span>
              </div>
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
              ></div>
              <div class="absolute bottom-0 left-0 right-0 p-6">
                <div class="flex items-center text-white mb-2">
                  <span class="material-icons text-3xl mr-2">{{
                    amenity.icon
                  }}</span>
                  <h3 class="text-2xl font-bold">{{ amenity.name }}</h3>
                </div>
              </div>
            </div>

            <div class="p-6">
              <p class="text-gray-600 mb-4">{{ amenity.description }}</p>

              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center text-gray-700">
                  <span class="material-icons text-primary-600 mr-2"
                    >people</span
                  >
                  <span class="font-semibold"
                    >Capacity: {{ amenity.capacity }}</span
                  >
                </div>
              </div>

              <button
                *ngIf="amenity.available"
                (click)="openBookingModal(amenity)"
                class="btn-primary w-full"
              >
                Book Now
              </button>
              <button
                *ngIf="!amenity.available"
                disabled
                class="btn-secondary w-full opacity-50 cursor-not-allowed"
              >
                Currently Unavailable
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Modal -->
    <div
      *ngIf="showBookingModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      (click)="closeBookingModal()"
    >
      <div class="card max-w-md w-full p-8" (click)="$event.stopPropagation()">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">
            Book {{ selectedAmenity?.name }}
          </h2>
          <button
            (click)="closeBookingModal()"
            class="text-gray-400 hover:text-gray-600"
          >
            <span class="material-icons">close</span>
          </button>
        </div>

        <form (ngSubmit)="submitBooking()">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Booking Date</label
              >
              <input
                type="date"
                [(ngModel)]="bookingForm.booking_date"
                name="booking_date"
                [min]="minDate"
                required
                class="input-field"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Start Time</label
              >
              <input
                type="time"
                [(ngModel)]="bookingForm.start_time"
                name="start_time"
                required
                class="input-field"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >End Time</label
              >
              <input
                type="time"
                [(ngModel)]="bookingForm.end_time"
                name="end_time"
                required
                class="input-field"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Notes (Optional)</label
              >
              <textarea
                [(ngModel)]="bookingForm.notes"
                name="notes"
                rows="3"
                class="input-field"
                placeholder="Any special requirements..."
              ></textarea>
            </div>

            <div
              *ngIf="bookingError"
              class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
            >
              {{ bookingError }}
            </div>

            <div
              *ngIf="bookingSuccess"
              class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg"
            >
              {{ bookingSuccess }}
            </div>

            <div class="flex gap-3">
              <button
                type="button"
                (click)="closeBookingModal()"
                class="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                [disabled]="bookingLoading"
                class="btn-primary flex-1"
              >
                <span *ngIf="!bookingLoading">Submit Booking</span>
                <span *ngIf="bookingLoading">Submitting...</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class AmenitiesComponent implements OnInit {
  amenities: Amenity[] = [];
  loading = true;
  showBookingModal = false;
  selectedAmenity: Amenity | null = null;
  bookingLoading = false;
  bookingError = "";
  bookingSuccess = "";
  minDate = new Date().toISOString().split("T")[0];

  bookingForm = {
    booking_date: "",
    start_time: "",
    end_time: "",
    notes: "",
  };

  constructor(
    private amenityService: AmenityService,
    private bookingService: BookingService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAmenities();
  }

  loadAmenities() {
    this.amenityService.getAmenities().subscribe({
      next: (amenities) => {
        this.amenities = amenities;
        this.loading = false;
      },
      error: (error) => {
        console.error("Error loading amenities:", error);
        this.loading = false;
      },
    });
  }

  openBookingModal(amenity: Amenity) {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(["/login"], {
        queryParams: { returnUrl: "/amenities" },
      });
      return;
    }

    this.selectedAmenity = amenity;
    this.showBookingModal = true;
    this.bookingError = "";
    this.bookingSuccess = "";
  }

  closeBookingModal() {
    this.showBookingModal = false;
    this.selectedAmenity = null;
    this.bookingForm = {
      booking_date: "",
      start_time: "",
      end_time: "",
      notes: "",
    };
  }

  submitBooking() {
    if (!this.selectedAmenity) return;

    this.bookingLoading = true;
    this.bookingError = "";
    this.bookingSuccess = "";

    const booking: Booking = {
      amenity_id: this.selectedAmenity.id,
      booking_date: this.bookingForm.booking_date,
      start_time: this.bookingForm.start_time,
      end_time: this.bookingForm.end_time,
      notes: this.bookingForm.notes,
    };

    this.bookingService.createBooking(booking).subscribe({
      next: (response) => {
        this.bookingLoading = false;
        this.bookingSuccess =
          "Booking request submitted successfully! Awaiting approval.";
        setTimeout(() => {
          this.closeBookingModal();
          this.router.navigate(["/bookings"]);
        }, 2000);
      },
      error: (error) => {
        this.bookingLoading = false;
        this.bookingError =
          error.error?.error || "Failed to submit booking. Please try again.";
      },
    });
  }
}
