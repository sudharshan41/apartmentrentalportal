import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { UnitService, Unit } from "../../../services/unit.service";

@Component({
  selector: "app-flat-detail",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-gray-50 min-h-screen">
      <div *ngIf="loading" class="flex items-center justify-center py-20">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"
        ></div>
      </div>

      <div
        *ngIf="!loading && unit"
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <!-- Back Button -->
        <button
          (click)="goBack()"
          class="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <span class="material-icons mr-1">arrow_back</span>
          Back to Listings
        </button>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <!-- Image -->
          <div class="relative">
            <img
              [src]="unit.image_url"
              [alt]="unit.unit_number"
              class="w-full h-96 object-cover rounded-xl shadow-lg"
            />
            <div class="absolute top-4 right-4">
              <span
                class="badge text-lg px-4 py-2"
                [ngClass]="{
                  'badge-success': unit.status === 'available',
                  'badge-warning': unit.status === 'occupied',
                  'badge-danger': unit.status === 'maintenance'
                }"
              >
                {{ unit.status }}
              </span>
            </div>
          </div>

          <!-- Details Card -->
          <div class="card p-8">
            <div class="mb-6">
              <h1 class="text-4xl font-bold text-gray-900 mb-2">
                {{ unit.unit_number }}
              </h1>
              <p class="text-xl text-gray-600 flex items-center">
                <span class="material-icons text-primary-600 mr-2"
                  >location_city</span
                >
                {{ unit.tower_name }}
              </p>
            </div>

            <div class="mb-6">
              <div class="flex items-baseline">
                <span class="text-4xl font-bold text-primary-600"
                  >\${{ unit.rent_amount }}</span
                >
                <span class="text-gray-600 ml-2">per month</span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-6">
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="flex items-center text-gray-600 mb-2">
                  <span class="material-icons mr-2">bed</span>
                  <span class="text-sm font-medium">Bedrooms</span>
                </div>
                <p class="text-2xl font-bold text-gray-900">
                  {{ unit.bedrooms }}
                </p>
              </div>

              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="flex items-center text-gray-600 mb-2">
                  <span class="material-icons mr-2">bathtub</span>
                  <span class="text-sm font-medium">Bathrooms</span>
                </div>
                <p class="text-2xl font-bold text-gray-900">
                  {{ unit.bathrooms }}
                </p>
              </div>

              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="flex items-center text-gray-600 mb-2">
                  <span class="material-icons mr-2">square_foot</span>
                  <span class="text-sm font-medium">Area</span>
                </div>
                <p class="text-2xl font-bold text-gray-900">
                  {{ unit.area_sqft }}
                  <span class="text-sm font-normal">sqft</span>
                </p>
              </div>

              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="flex items-center text-gray-600 mb-2">
                  <span class="material-icons mr-2">layers</span>
                  <span class="text-sm font-medium">Floor</span>
                </div>
                <p class="text-2xl font-bold text-gray-900">{{ unit.floor }}</p>
              </div>
            </div>

            <div *ngIf="unit.status === 'available'" class="space-y-3">
              <button class="btn-primary w-full text-lg py-3">
                Contact Us
              </button>
              <button class="btn-secondary w-full text-lg py-3">
                Schedule Visit
              </button>
            </div>
            <div
              *ngIf="unit.status !== 'available'"
              class="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg"
            >
              <p class="font-semibold">
                This unit is currently {{ unit.status }}
              </p>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="card p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Description</h2>
          <p class="text-gray-700 leading-relaxed">{{ unit.description }}</p>
        </div>

        <!-- Features & Amenities -->
        <div class="card p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">
            Features & Amenities
          </h2>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div class="flex items-center text-gray-700">
              <span class="material-icons text-green-600 mr-2"
                >check_circle</span
              >
              <span>24/7 Security</span>
            </div>
            <div class="flex items-center text-gray-700">
              <span class="material-icons text-green-600 mr-2"
                >check_circle</span
              >
              <span>Power Backup</span>
            </div>
            <div class="flex items-center text-gray-700">
              <span class="material-icons text-green-600 mr-2"
                >check_circle</span
              >
              <span>Parking</span>
            </div>
            <div class="flex items-center text-gray-700">
              <span class="material-icons text-green-600 mr-2"
                >check_circle</span
              >
              <span>Elevator</span>
            </div>
            <div class="flex items-center text-gray-700">
              <span class="material-icons text-green-600 mr-2"
                >check_circle</span
              >
              <span>Swimming Pool</span>
            </div>
            <div class="flex items-center text-gray-700">
              <span class="material-icons text-green-600 mr-2"
                >check_circle</span
              >
              <span>Gym</span>
            </div>
            <div class="flex items-center text-gray-700">
              <span class="material-icons text-green-600 mr-2"
                >check_circle</span
              >
              <span>Club House</span>
            </div>
            <div class="flex items-center text-gray-700">
              <span class="material-icons text-green-600 mr-2"
                >check_circle</span
              >
              <span>Kids Play Area</span>
            </div>
          </div>
        </div>

        <!-- Additional Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="card p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span class="material-icons text-primary-600 mr-2">info</span>
              Property Details
            </h3>
            <div class="space-y-3">
              <div class="flex justify-between py-2 border-b border-gray-200">
                <span class="text-gray-600">Property ID</span>
                <span class="font-semibold text-gray-900">{{ unit.id }}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-gray-200">
                <span class="text-gray-600">Tower</span>
                <span class="font-semibold text-gray-900">{{
                  unit.tower_name
                }}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-gray-200">
                <span class="text-gray-600">Unit Number</span>
                <span class="font-semibold text-gray-900">{{
                  unit.unit_number
                }}</span>
              </div>
              <div class="flex justify-between py-2">
                <span class="text-gray-600">Floor</span>
                <span class="font-semibold text-gray-900">{{
                  unit.floor
                }}</span>
              </div>
            </div>
          </div>

          <div class="card p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span class="material-icons text-primary-600 mr-2"
                >contact_support</span
              >
              Need Help?
            </h3>
            <div class="space-y-4">
              <p class="text-gray-600">
                Contact our team for more information or to schedule a visit.
              </p>
              <div class="space-y-2">
                <div class="flex items-center text-gray-700">
                  <span class="material-icons text-primary-600 mr-2"
                    >phone</span
                  >
                  <span>+1 (555) 123-4567</span>
                </div>
                <div class="flex items-center text-gray-700">
                  <span class="material-icons text-primary-600 mr-2"
                    >email</span
                  >
                  <span>info&#64;rentalportal.com</span>
                </div>
                <div class="flex items-center text-gray-700">
                  <span class="material-icons text-primary-600 mr-2"
                    >schedule</span
                  >
                  <span>Mon - Sat: 9AM - 6PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class FlatDetailComponent implements OnInit {
  unit: Unit | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private unitService: UnitService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params["id"];
    this.loadUnit(id);
  }

  loadUnit(id: number) {
    this.unitService.getUnit(id).subscribe({
      next: (unit) => {
        this.unit = unit;
        this.loading = false;
      },
      error: (error) => {
        console.error("Error loading unit:", error);
        this.loading = false;
        this.router.navigate(["/flats"]);
      },
    });
  }

  goBack() {
    this.router.navigate(["/flats"]);
  }
}
