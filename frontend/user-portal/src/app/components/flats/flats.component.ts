import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { UnitService, Unit } from "../../services/unit.service";

@Component({
  selector: "app-flats",
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="bg-gray-50 min-h-screen">
      <!-- Page Header -->
      <div
        class="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 class="text-4xl font-bold mb-2">Browse Apartments</h1>
          <p class="text-xl text-primary-100">
            Find your perfect home from our available units
          </p>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Filters -->
        <div class="card p-6 mb-8">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Status</label
              >
              <select
                [(ngModel)]="filters.status"
                (change)="applyFilters()"
                class="input-field"
              >
                <option value="">All</option>
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Bedrooms</label
              >
              <select
                [(ngModel)]="filters.bedrooms"
                (change)="applyFilters()"
                class="input-field"
              >
                <option value="">All</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Max Rent</label
              >
              <select
                [(ngModel)]="filters.maxRent"
                (change)="applyFilters()"
                class="input-field"
              >
                <option value="">All</option>
                <option value="1000">Up to $1000</option>
                <option value="1500">Up to $1500</option>
                <option value="2000">Up to $2000</option>
                <option value="2500">Up to $2500</option>
              </select>
            </div>

            <div class="flex items-end">
              <button (click)="resetFilters()" class="btn-secondary w-full">
                <span class="flex items-center justify-center">
                  <span class="material-icons text-sm mr-1">refresh</span>
                  Reset
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- Results Count -->
        <div class="mb-6">
          <p class="text-gray-600">
            Showing
            <span class="font-semibold">{{ filteredUnits.length }}</span>
            {{ filteredUnits.length === 1 ? "apartment" : "apartments" }}
          </p>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="text-center py-12">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"
          ></div>
          <p class="mt-4 text-gray-600">Loading apartments...</p>
        </div>

        <!-- Units Grid -->
        <div
          *ngIf="!loading"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <div
            *ngFor="let unit of filteredUnits"
            class="card group cursor-pointer"
          >
            <div class="relative overflow-hidden h-56">
              <img
                [src]="unit.image_url"
                [alt]="unit.unit_number"
                class="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div class="absolute top-4 right-4">
                <span
                  class="badge"
                  [ngClass]="{
                    'badge-success': unit.status === 'available',
                    'badge-warning': unit.status === 'occupied',
                    'badge-danger': unit.status === 'maintenance'
                  }"
                >
                  {{ unit.status }}
                </span>
              </div>
              <div
                class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4"
              >
                <div class="flex justify-between items-end">
                  <div>
                    <h3 class="text-white text-xl font-bold">
                      {{ unit.unit_number }}
                    </h3>
                    <p class="text-white/90 text-sm">{{ unit.tower_name }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-white text-2xl font-bold">
                      \${{ unit.rent_amount }}
                    </p>
                    <p class="text-white/90 text-xs">per month</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="p-6">
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

              <div class="flex items-center text-gray-600 text-sm mb-4">
                <span class="material-icons text-sm mr-1">location_on</span>
                <span>Floor {{ unit.floor }}</span>
              </div>

              <a
                [routerLink]="['/flats', unit.id]"
                class="btn-primary w-full text-center block"
              >
                View Details
              </a>
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div
          *ngIf="!loading && filteredUnits.length === 0"
          class="text-center py-12"
        >
          <span class="material-icons text-gray-400 text-6xl mb-4"
            >search_off</span
          >
          <h3 class="text-xl font-semibold text-gray-700 mb-2">
            No apartments found
          </h3>
          <p class="text-gray-600 mb-4">Try adjusting your filters</p>
          <button (click)="resetFilters()" class="btn-primary">
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  `,
})
export class FlatsComponent implements OnInit {
  units: Unit[] = [];
  filteredUnits: Unit[] = [];
  loading = true;

  filters = {
    status: "",
    bedrooms: "",
    maxRent: "",
  };

  constructor(private unitService: UnitService) {}

  ngOnInit() {
    this.loadUnits();
  }

  loadUnits() {
    this.unitService.getUnits().subscribe({
      next: (units) => {
        this.units = units;
        this.filteredUnits = units;
        this.loading = false;
      },
      error: (error) => {
        console.error("Error loading units:", error);
        this.loading = false;
      },
    });
  }

  applyFilters() {
    this.filteredUnits = this.units.filter((unit) => {
      if (this.filters.status && unit.status !== this.filters.status)
        return false;
      if (
        this.filters.bedrooms &&
        unit.bedrooms.toString() !== this.filters.bedrooms
      )
        return false;
      if (
        this.filters.maxRent &&
        unit.rent_amount > parseFloat(this.filters.maxRent)
      )
        return false;
      return true;
    });
  }

  resetFilters() {
    this.filters = {
      status: "",
      bedrooms: "",
      maxRent: "",
    };
    this.filteredUnits = this.units;
  }
}
