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
  public username = '';
  public password = '';
  public showPopup = false;
  public popupMessage = '';

  public constructor(private authService: AuthService, private router: Router) {}

  public onSubmit(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
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

  public showPopupMessage(message: string): void {
    this.popupMessage = message;
    this.showPopup = true;
    setTimeout(() => {
      this.showPopup = false;
    }, 3000);
  }
}
