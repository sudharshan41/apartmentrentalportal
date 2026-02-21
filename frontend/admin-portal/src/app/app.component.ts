import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { AuthService } from "./services/auth.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  template: `
    <div class="min-h-screen" *ngIf="isAuthenticated()">
      <app-sidebar></app-sidebar>
      <main class="ml-64 bg-gray-50 min-h-screen">
        <router-outlet></router-outlet>
      </main>
    </div>
    <div *ngIf="!isAuthenticated()" class="min-h-screen">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {
  constructor(public authService: AuthService) {}

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
