import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { environment } from "../../environments/environment";

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  role: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const user = this.getUserFromStorage();
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem("access_token", response.access_token);
          localStorage.setItem("user", JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        })
      );
  }

  register(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/register`, data);
  }

  logout(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem("access_token");
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }
}
