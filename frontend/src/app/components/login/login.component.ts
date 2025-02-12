// login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  showPopup: boolean = false; // Controls the visibility of the popup
  popupMessage: string = ''; // Stores the message to display in the popup

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: (response: any) => {
        this.authService.setCurrentUser(this.username);
        // Update the current user
        localStorage.setItem('currentUser', this.username); // Store the username in localStorage
        this.showPopupMessage('Login successful!');
        setTimeout(() => {
          this.router.navigate(['/meal-list']);
        }, 1000);
      },
      error: (error) => {
        console.error('Login failed!', error);
        this.showPopupMessage('Invalid credentials. Please try again.');
      },
    });
  }

  showPopupMessage(message: string): void {
    this.popupMessage = message;
    this.showPopup = true;
    setTimeout(() => {
      this.showPopup = false;
    }, 3000);
  }
}