import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface AuthResponse {
  token: string;
  userId: number;
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<string | null>(null);
  private currentUserIdSubject = new BehaviorSubject<number | null>(null);

  public currentUser$ = this.currentUserSubject.asObservable();
  public currentUserId$ = this.currentUserIdSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // Check for stored values in localStorage on initialization
    const storedUser = localStorage.getItem('currentUser');
    const storedUserId = localStorage.getItem('currentUserId');

    if (storedUser && storedUserId) {
      this.currentUserSubject.next(storedUser);
      this.currentUserIdSubject.next(Number(storedUserId));
    }
  }

  login(username: string, password: string): Observable<AuthResponse> {
    const authRequest = { username, password };
    return this.http.post<AuthResponse>('http://localhost:9393/api/auth/login', authRequest).pipe(
      tap((response) => {
        // Store the token in localStorage
        localStorage.setItem('token', response.token);

        // Store the username and ID in the BehaviorSubject
        this.currentUserSubject.next(response.username);
        this.currentUserIdSubject.next(response.userId);

        // Store the username and ID in localStorage for persistence
        localStorage.setItem('currentUser', response.username);
        localStorage.setItem('currentUserId', response.userId.toString());
      })
    );
  }

  logout() {
    this.currentUserSubject.next(null); // Clear the current user
    this.currentUserIdSubject.next(null); // Clear the current user ID
    localStorage.removeItem('currentUser'); // Remove the username from localStorage
    localStorage.removeItem('currentUserId'); // Remove the user ID from localStorage
    localStorage.removeItem('token'); // Remove the token from localStorage
    this.router.navigate(['/']);
  }

  getCurrentUser(): string | null {
    return this.currentUserSubject.value;
  }

  getCurrentUserId(): number | null {
    return this.currentUserIdSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  setCurrentUser(username: string | null): void {
    this.currentUserSubject.next(username);
    if (username) {
      localStorage.setItem('currentUser', username);
    } else {
      localStorage.removeItem('currentUser');
    }
  }
}