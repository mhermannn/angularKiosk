import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponseDto } from '../shared/models/authresponse.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<string | null>(null);
  private currentUserIdSubject = new BehaviorSubject<number | null>(null);
  private userRoleSubject = new BehaviorSubject<string | null>(null);
  private userResourcesSubject = new BehaviorSubject<number | null>(null);

  public currentUser$ = this.currentUserSubject.asObservable();
  public currentUserId$ = this.currentUserIdSubject.asObservable();
  public userRole$ = this.userRoleSubject.asObservable();
  public userResources$ = this.userResourcesSubject.asObservable();

  public constructor(private http: HttpClient, private router: Router) {
    const storedUser = localStorage.getItem('currentUser');
    const storedUserId = localStorage.getItem('currentUserId');
    const storedRole = localStorage.getItem('userRole');
    const storedResources = localStorage.getItem('userResources');

    if (storedUser && storedUserId && storedRole && storedResources) {
      this.currentUserSubject.next(storedUser);
      this.currentUserIdSubject.next(Number(storedUserId));
      this.userRoleSubject.next(storedRole);
      this.userResourcesSubject.next(Number(storedResources));
    }
  }

  public login(username: string, password: string): Observable<AuthResponseDto> {
    const authRequest = { username, password };

    return this.http.post<AuthResponseDto>('http://localhost:9393/api/auth/login', authRequest).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('currentUser', response.username);
        localStorage.setItem('currentUserId', response.userId.toString());
        localStorage.setItem('userRole', response.role);
        localStorage.setItem('userResources', response.resources.toString());

        this.currentUserSubject.next(response.username);
        this.currentUserIdSubject.next(response.userId);
        this.userRoleSubject.next(response.role);
        this.userResourcesSubject.next(response.resources);
      })
    );
  }

  public logout(): void {
    this.currentUserSubject.next(null);
    this.currentUserIdSubject.next(null);
    this.userRoleSubject.next(null);
    this.userResourcesSubject.next(null);

    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userResources');
    localStorage.removeItem('token');

    this.router.navigate(['/']);
  }

  public getCurrentUser(): string | null {
    return this.currentUserSubject.value;
  }

  public getCurrentUserId(): number | null {
    return this.currentUserIdSubject.value;
  }

  public getUserRole(): string | null {
    return this.userRoleSubject.value;
  }

  public getUserResources(): number | null {
    return this.userResourcesSubject.value;
  }

  public isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  public isAdmin(): boolean {
    return this.userRoleSubject.value === 'ADMIN';
  }

  public setCurrentUser(username: string | null): void {
    this.currentUserSubject.next(username);
    if (username) {
      localStorage.setItem('currentUser', username);
    } else {
      localStorage.removeItem('currentUser');
    }
  }
}
