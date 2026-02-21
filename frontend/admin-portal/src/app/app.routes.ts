import { Routes } from "@angular/router";
import { authGuard } from "./guards/auth.guard";
import { adminGuard } from "./guards/admin.guard";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full",
  },
  {
    path: "login",
    loadComponent: () =>
      import("./components/login/login.component").then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: "dashboard",
    loadComponent: () =>
      import("./components/dashboard/dashboard.component").then(
        (m) => m.DashboardComponent
      ),
    canActivate: [authGuard, adminGuard],
  },
  {
    path: "units",
    loadComponent: () =>
      import("./components/units/units.component").then(
        (m) => m.UnitsComponent
      ),
    canActivate: [authGuard, adminGuard],
  },
  {
    path: "towers",
    loadComponent: () =>
      import("./components/towers/towers.component").then(
        (m) => m.TowersComponent
      ),
    canActivate: [authGuard, adminGuard],
  },
  {
    path: "amenities",
    loadComponent: () =>
      import("./components/amenities/amenities.component").then(
        (m) => m.AmenitiesComponent
      ),
    canActivate: [authGuard, adminGuard],
  },
  {
    path: "bookings",
    loadComponent: () =>
      import("./components/bookings/bookings.component").then(
        (m) => m.BookingsComponent
      ),
    canActivate: [authGuard, adminGuard],
  },
  {
    path: "tenants",
    loadComponent: () =>
      import("./components/tenants/tenants.component").then(
        (m) => m.TenantsComponent
      ),
    canActivate: [authGuard, adminGuard],
  },
  {
    path: "**",
    redirectTo: "dashboard",
  },
];
