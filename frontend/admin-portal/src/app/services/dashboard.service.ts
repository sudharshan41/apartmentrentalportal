import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

export interface DashboardStats {
  total_units: number;
  occupied_units: number;
  available_units: number;
  occupancy_rate: number;
  total_tenants: number;
  pending_bookings: number;
  total_revenue: number;
}

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(
      `${environment.apiUrl}/stats/dashboard`
    );
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/users`);
  }

  getTowers(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/towers`);
  }

  getBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/bookings`);
  }

  getUnits(params?: any): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/units`, { params });
  }

  getAmenities(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/amenities`);
  }

  updateBookingStatus(
    id: number,
    status: string,
    admin_notes?: string
  ): Observable<any> {
    return this.http.put(`${environment.apiUrl}/bookings/${id}`, {
      status,
      admin_notes,
    });
  }

  createUnit(unit: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/units`, unit);
  }

  updateUnit(id: number, unit: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/units/${id}`, unit);
  }

  deleteUnit(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/units/${id}`);
  }

  createTower(tower: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/towers`, tower);
  }

  updateTower(id: number, tower: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/towers/${id}`, tower);
  }

  deleteTower(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/towers/${id}`);
  }

  createAmenity(amenity: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/amenities`, amenity);
  }

  updateAmenity(id: number, amenity: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/amenities/${id}`, amenity);
  }

  deleteAmenity(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/amenities/${id}`);
  }
}
