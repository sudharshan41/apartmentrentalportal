import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardService } from "../../services/dashboard.service";

@Component({
  selector: "app-tenants",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Tenants Management</h1>

      <div class="card overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Phone
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Role
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let user of users">
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
                {{ user.full_name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ user.email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ user.phone || "N/A" }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="badge badge-info">{{ user.role }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class TenantsComponent implements OnInit {
  users: any[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getUsers().subscribe({
      next: (users) => (this.users = users),
      error: (error) => console.error("Error:", error),
    });
  }
}
