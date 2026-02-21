import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DashboardService } from "../../services/dashboard.service";

@Component({
  selector: "app-towers",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Towers Management</h1>
        <button class="btn-primary" (click)="showForm = true">
          Add New Tower
        </button>
      </div>

      <!-- ADD TOWER FORM -->
      <div *ngIf="showForm" class="card p-6 mb-8">
        <h2 class="text-xl font-bold mb-4">Add Tower</h2>

        <div class="grid gap-4">
          <input
            type="text"
            placeholder="Tower Name"
            [(ngModel)]="newTower.name"
            class="border p-2 rounded"
          />

          <input
            type="text"
            placeholder="Address"
            [(ngModel)]="newTower.address"
            class="border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Total Floors"
            [(ngModel)]="newTower.total_floors"
            class="border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Total Units"
            [(ngModel)]="newTower.total_units"
            class="border p-2 rounded"
          />

          <div class="flex gap-4">
            <button
              class="bg-green-600 text-white px-4 py-2 rounded"
              (click)="addTower()"
            >
              Save
            </button>

            <button
              class="bg-gray-400 text-white px-4 py-2 rounded"
              (click)="showForm = false"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- TOWER LIST -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div *ngFor="let tower of towers; let i = index" class="card p-6 relative">

          <!-- DELETE BUTTON -->
          <button
            class="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
            (click)="removeTower(i)"
          >
            Remove
          </button>

          <h3 class="text-2xl font-bold text-gray-900 mb-2">
            {{ tower.name }}
          </h3>

          <p class="text-gray-600 mb-4">{{ tower.address }}</p>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600">Total Floors</p>
              <p class="text-2xl font-bold text-primary-600">
                {{ tower.total_floors }}
              </p>
            </div>

            <div>
              <p class="text-sm text-gray-600">Total Units</p>
              <p class="text-2xl font-bold text-primary-600">
                {{ tower.total_units }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TowersComponent implements OnInit {
  towers: any[] = [];
  showForm = false;

  newTower = {
    name: "",
    address: "",
    total_floors: 0,
    total_units: 0,
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getTowers().subscribe({
      next: (towers) => (this.towers = towers),
      error: (error) => console.error("Error:", error),
    });
  }

  addTower() {
    this.towers.push({ ...this.newTower });

    this.newTower = {
      name: "",
      address: "",
      total_floors: 0,
      total_units: 0,
    };

    this.showForm = false;
  }

  removeTower(index: number) {
    this.towers.splice(index, 1);
  }
}