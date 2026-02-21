import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { UnitService, Unit } from "../../services/unit.service";
import { AmenityService, Amenity } from "../../services/amenity.service";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Hero Section -->
    <div
      class="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <h1 class="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Find Your Dream Home
          </h1>
          <p class="text-xl md:text-2xl mb-8 text-primary-100">
            Premium apartments with world-class amenities
          </p>
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <a
              routerLink="/flats"
              class="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition duration-200 shadow-lg"
            >
              Browse Apartments
            </a>
            <a
              routerLink="/amenities"
              class="bg-transparent border-2 border-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition duration-200"
            >
              View Amenities
            </a>
          </div>
        </div>
      </div>
      <div class="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="#F9FAFB"
          />
        </svg>
      </div>
    </div>

    <!-- Features Section -->
    <div class="bg-gray-50 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Us
          </h2>
          <p class="text-xl text-gray-600">
            Experience luxury living with premium facilities
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="card p-8 text-center">
            <div
              class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span class="material-icons text-primary-600 text-3xl"
                >verified</span
              >
            </div>
            <h3 class="text-xl font-semibold mb-2">Verified Properties</h3>
            <p class="text-gray-600">
              All properties are verified and maintained to highest standards
            </p>
          </div>

          <div class="card p-8 text-center">
            <div
              class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span class="material-icons text-green-600 text-3xl"
                >security</span
              >
            </div>
            <h3 class="text-xl font-semibold mb-2">24/7 Security</h3>
            <p class="text-gray-600">
              Round-the-clock security for your peace of mind
            </p>
          </div>

          <div class="card p-8 text-center">
            <div
              class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span class="material-icons text-purple-600 text-3xl">stars</span>
            </div>
            <h3 class="text-xl font-semibold mb-2">Premium Amenities</h3>
            <p class="text-gray-600">
              Access to gym, pool, parking and more facilities
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Featured Apartments -->
    <div class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-12">
          <div>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Featured Apartments
            </h2>
            <p class="text-gray-600">Discover our best available units</p>
          </div>
          <a
            routerLink="/flats"
            class="text-primary-600 hover:text-primary-700 font-semibold flex items-center"
          >
            View All
            <span class="material-icons ml-1">arrow_forward</span>
          </a>
        </div>

        <div *ngIf="loading" class="text-center py-12">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"
          ></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div *ngFor="let unit of featuredUnits" class="card group">
            <div class="relative overflow-hidden h-48">
              <img
                [src]="unit.image_url"
                [alt]="unit.unit_number"
                class="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div class="absolute top-4 right-4">
                <span class="badge badge-success">{{ unit.status }}</span>
              </div>
            </div>
            <div class="p-6">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-xl font-semibold text-gray-900">
                  {{ unit.unit_number }}
                </h3>
                <span class="text-2xl font-bold text-primary-600"
                  >\${{ unit.rent_amount }}</span
                >
              </div>
              <p class="text-gray-600 text-sm mb-4">{{ unit.tower_name }}</p>
              <div class="flex items-center gap-4 mb-4 text-gray-600">
                <div class="flex items-center">
                  <span class="material-icons text-sm mr-1">bed</span>
                  <span class="text-sm">{{ unit.bedrooms }} Beds</span>
                </div>
                <div class="flex items-center">
                  <span class="material-icons text-sm mr-1">bathtub</span>
                  <span class="text-sm">{{ unit.bathrooms }} Baths</span>
                </div>
                <div class="flex items-center">
                  <span class="material-icons text-sm mr-1">square_foot</span>
                  <span class="text-sm">{{ unit.area_sqft }} sqft</span>
                </div>
              </div>
              <p class="text-gray-600 text-sm mb-4 line-clamp-2">
                {{ unit.description }}
              </p>
              <a
                [routerLink]="['/flats', unit.id]"
                class="btn-primary w-full text-center block"
              >
                View Details
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Amenities Section -->
    <div class="bg-gray-50 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            World-Class Amenities
          </h2>
          <p class="text-xl text-gray-600">
            Everything you need for a comfortable lifestyle
          </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <div
            *ngFor="let amenity of amenities.slice(0, 6)"
            class="card p-6 text-center hover:shadow-xl transition-all duration-300"
          >
            <div
              class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3"
            >
              <span class="material-icons text-primary-600 text-2xl">{{
                amenity.icon
              }}</span>
            </div>
            <h3 class="text-sm font-semibold text-gray-900">
              {{ amenity.name }}
            </h3>
          </div>
        </div>

        <div class="text-center mt-8">
          <a routerLink="/amenities" class="btn-primary">
            View All Amenities
          </a>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div
      class="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          Ready to Find Your Perfect Home?
        </h2>
        <p class="text-xl mb-8 text-primary-100">
          Join hundreds of satisfied residents today
        </p>
        <a
          routerLink="/register"
          class="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition duration-200 inline-block shadow-lg"
        >
          Get Started Now
        </a>
      </div>
    </div>
  `,
})
export class HomeComponent implements OnInit {
  featuredUnits: Unit[] = [];
  amenities: Amenity[] = [];
  loading = true;

  constructor(
    private unitService: UnitService,
    private amenityService: AmenityService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.unitService.getUnits("available").subscribe({
      next: (units) => {
        this.featuredUnits = units.slice(0, 6);
        this.loading = false;
      },
      error: (error) => {
        console.error("Error loading units:", error);
        this.loading = false;
      },
    });

    this.amenityService.getAmenities().subscribe({
      next: (amenities) => {
        this.amenities = amenities;
      },
      error: (error) => {
        console.error("Error loading amenities:", error);
      },
    });
  }
}
