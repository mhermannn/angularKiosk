import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<string | null>(null);
  setCurrentUser(username: string | null) {
    this.currentUserSubject.next(username);
  }
  
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    const authRequest = { username, password };
    return this.http.post('http://localhost:9393/api/auth/login', authRequest);
  }

  logout() {
    this.currentUserSubject.next(null); // Clear the current user
    localStorage.removeItem('currentUser'); // Remove the username from localStorage
    this.router.navigate(['/']);
  }

  getCurrentUser(): string | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }
}