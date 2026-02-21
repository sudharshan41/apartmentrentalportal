import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DashboardService } from "../../services/dashboard.service";

@Component({
  selector: "app-amenities",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Amenities Management</h1>
        <button class="btn-primary" (click)="showForm = true">
          Add New Amenity
        </button>
      </div>

      <div *ngIf="showForm" class="card p-6 mb-8">
        <h2 class="text-xl font-bold mb-4">Add Amenity</h2>

        <div class="grid gap-4">
          <input type="text" placeholder="Amenity Name"
            [(ngModel)]="newAmenity.name"
            class="border p-2 rounded" />

          <input type="text" placeholder="Description"
            [(ngModel)]="newAmenity.description"
            class="border p-2 rounded" />

          <input type="number" placeholder="Capacity"
            [(ngModel)]="newAmenity.capacity"
            class="border p-2 rounded" />

          <div class="flex gap-4">
            <button class="bg-green-600 text-white px-4 py-2 rounded"
              (click)="addAmenity()">Save</button>

            <button class="bg-gray-500 text-white px-4 py-2 rounded"
              (click)="showForm = false">Cancel</button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let amenity of amenities; let i = index"
          class="card p-6 relative">

          <button
            class="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
            (click)="removeAmenity(i)">
            Remove
          </button>

          <h3 class="text-xl font-bold text-gray-900 mb-2">
            {{ amenity.name }}
          </h3>

          <p>{{ amenity.description }}</p>
          <p><b>Capacity:</b> {{ amenity.capacity }}</p>
        </div>
      </div>
    </div>
  `,
})
export class AmenitiesComponent implements OnInit {
  amenities: any[] = [];
  showForm = false;

  newAmenity: any = {
    name: "",
    description: "",
    capacity: 0,
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getAmenities().subscribe({
      next: (data) => (this.amenities = data),
      error: (error) => console.error("Error:", error),
    });
  }

  addAmenity() {
    this.amenities.push({ ...this.newAmenity });

    this.newAmenity = {
      name: "",
      description: "",
      capacity: 0,
    };

    this.showForm = false;
  }

  removeAmenity(index: number) {
    this.amenities.splice(index, 1);
  }
}