import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="bg-gray-900 text-white mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center mb-4">
              <span class="material-icons text-primary-400 text-3xl mr-2"
                >apartment</span
              >
              <span class="text-xl font-bold">RentalPortal</span>
            </div>
            <p class="text-gray-400 text-sm">
              Find your perfect home in our premium residential apartments with
              world-class amenities.
            </p>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
            <ul class="space-y-2">
              <li>
                <a
                  routerLink="/"
                  class="text-gray-400 hover:text-white transition"
                  >Home</a
                >
              </li>
              <li>
                <a
                  routerLink="/flats"
                  class="text-gray-400 hover:text-white transition"
                  >Browse Flats</a
                >
              </li>
              <li>
                <a
                  routerLink="/amenities"
                  class="text-gray-400 hover:text-white transition"
                  >Amenities</a
                >
              </li>
              <li>
                <a
                  routerLink="/bookings"
                  class="text-gray-400 hover:text-white transition"
                  >My Bookings</a
                >
              </li>
            </ul>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-4">Contact</h3>
            <ul class="space-y-2 text-gray-400">
              <li class="flex items-center">
                <span class="material-icons text-sm mr-2">phone</span>
                +1 (555) 123-4567
              </li>
              <li class="flex items-center">
                <span class="material-icons text-sm mr-2">email</span>
                info&#64;rentalportal.com
              </li>
              <li class="flex items-center">
                <span class="material-icons text-sm mr-2">location_on</span>
                123 Main St, City
              </li>
            </ul>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-4">Follow Us</h3>
            <div class="flex space-x-4">
              <a
                href="#"
                class="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition"
              >
                <span class="material-icons text-sm">facebook</span>
              </a>
              <a
                href="#"
                class="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition"
              >
                <span class="material-icons text-sm">link</span>
              </a>
              <a
                href="#"
                class="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition"
              >
                <span class="material-icons text-sm">camera_alt</span>
              </a>
            </div>
          </div>
        </div>

        <div
          class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm"
        >
          <p>&copy; 2024 RentalPortal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
