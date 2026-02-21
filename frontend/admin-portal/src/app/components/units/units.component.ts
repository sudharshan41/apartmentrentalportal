import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DashboardService } from "../../services/dashboard.service";

@Component({
  selector: "app-units",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Units Management</h1>
        <button class="btn-primary" (click)="showForm = true">
          Add New Unit
        </button>
      </div>

      <!-- Add Unit Form -->
      <div *ngIf="showForm" class="card p-6 mb-8">
        <h2 class="text-xl font-bold mb-4">Add Unit</h2>

        <div class="grid gap-4">
          <input type="text" placeholder="Unit Number"
            [(ngModel)]="newUnit.unit_number"
            class="border p-2 rounded" />

          <input type="text" placeholder="Tower Name"
            [(ngModel)]="newUnit.tower_name"
            class="border p-2 rounded" />

          <input type="number" placeholder="Bedrooms"
            [(ngModel)]="newUnit.bedrooms"
            class="border p-2 rounded" />

          <input type="number" placeholder="Rent Amount"
            [(ngModel)]="newUnit.rent_amount"
            class="border p-2 rounded" />

          <select [(ngModel)]="newUnit.status"
            class="border p-2 rounded">
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
          </select>

          <div class="flex gap-4">
            <button class="bg-green-600 text-white px-4 py-2 rounded"
              (click)="addUnit()">Save</button>

            <button class="bg-gray-500 text-white px-4 py-2 rounded"
              (click)="showForm = false">Cancel</button>
          </div>
        </div>
      </div>

      <!-- Units List -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let unit of units; let i = index"
          class="card p-6 relative">

          <button
            class="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
            (click)="removeUnit(i)">
            Remove
          </button>

          <h3 class="text-xl font-bold text-gray-900 mb-2">
            {{ unit.unit_number }}
          </h3>

          <p class="text-gray-600 mb-4">{{ unit.tower_name }}</p>

          <p><b>Bedrooms:</b> {{ unit.bedrooms }}</p>
          <p><b>Rent:</b> \${{ unit.rent_amount }}/mo</p>
          <p><b>Status:</b> {{ unit.status }}</p>
        </div>
      </div>
    </div>
  `,
})
export class UnitsComponent implements OnInit {
  units: any[] = [];
  showForm = false;

  newUnit: any = {
    unit_number: "",
    tower_name: "",
    bedrooms: 0,
    rent_amount: 0,
    status: "available",
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getUnits().subscribe({
      next: (data) => (this.units = data),
      error: (error) => console.error("Error:", error),
    });
  }

  addUnit() {
    this.units.push({ ...this.newUnit });

    this.newUnit = {
      unit_number: "",
      tower_name: "",
      bedrooms: 0,
      rent_amount: 0,
      status: "available",
    };

    this.showForm = false;
  }

  removeUnit(index: number) {
    this.units.splice(index, 1);
  }
}