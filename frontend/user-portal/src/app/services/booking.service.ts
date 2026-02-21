import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

export interface Booking {
  id?: number;
  user_id?: number;
  user_name?: string;
  amenity_id: number;
  amenity_name?: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status?: string;
  notes?: string;
  admin_notes?: string;
}

@Injectable({
  providedIn: "root",
})
export class BookingService {
  constructor(private http: HttpClient) {}

  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${environment.apiUrl}/bookings`);
  }

  getBooking(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${environment.apiUrl}/bookings/${id}`);
  }

  createBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(`${environment.apiUrl}/bookings`, booking);
  }

  updateBooking(id: number, booking: Partial<Booking>): Observable<Booking> {
    return this.http.put<Booking>(
      `${environment.apiUrl}/bookings/${id}`,
      booking
    );
  }

  deleteBooking(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/bookings/${id}`);
  }
}
