import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

export interface Unit {
  id: number;
  tower_id: number;
  tower_name: string;
  unit_number: string;
  floor: number;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  rent_amount: number;
  status: string;
  description: string;
  image_url: string;
}

@Injectable({
  providedIn: "root",
})
export class UnitService {
  constructor(private http: HttpClient) {}

  getUnits(status?: string): Observable<Unit[]> {
    const options = status ? { params: { status } } : {};
    return this.http.get<Unit[]>(`${environment.apiUrl}/units`, options);
  }

  getUnit(id: number): Observable<Unit> {
    return this.http.get<Unit>(`${environment.apiUrl}/units/${id}`);
  }
}
