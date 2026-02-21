import { Routes } from "@angular/router";
import { authGuard } from "./guards/auth.guard";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./components/home/home.component").then((m) => m.HomeComponent),
  },
  {
    path: "login",
    loadComponent: () =>
      import("./components/auth/login/login.component").then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: "register",
    loadComponent: () =>
      import("./components/auth/register/register.component").then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: "flats",
    loadComponent: () =>
      import("./components/flats/flats.component").then(
        (m) => m.FlatsComponent
      ),
  },
  {
    path: "flats/:id",
    loadComponent: () =>
      import("./components/flats/flat-detail/flat-detail.component").then(
        (m) => m.FlatDetailComponent
      ),
  },
  {
    path: "amenities",
    loadComponent: () =>
      import("./components/amenities/amenities.component").then(
        (m) => m.AmenitiesComponent
      ),
  },
  {
    path: "bookings",
    loadComponent: () =>
      import("./components/bookings/bookings.component").then(
        (m) => m.BookingsComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: "**",
    redirectTo: "",
  },
];
