import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

export interface Amenity {
  id: number;
  name: string;
  description: string;
  capacity: number;
  available: boolean;
  icon: string;
  image_url: string;
}

@Injectable({
  providedIn: "root",
})
export class AmenityService {
  constructor(private http: HttpClient) {}

  getAmenities(): Observable<Amenity[]> {
    return this.http.get<Amenity[]>(`${environment.apiUrl}/amenities`);
  }

  getAmenity(id: number): Observable<Amenity> {
    return this.http.get<Amenity>(`${environment.apiUrl}/amenities/${id}`);
  }
}
