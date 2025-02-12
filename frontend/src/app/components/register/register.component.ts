import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  standalone: true,
})
export class RegisterComponent {
  registerForm: FormGroup;
  showPopup: boolean = false; // Controls the visibility of the popup
  popupMessage: string = ''; // Stores the message to display in the popup

  constructor(
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.showPopupMessage('Please fill out the form correctly.');
      return;
    }

    const registerRequest = {
      username: this.registerForm.value.username,
      password: this.registerForm.value.password,
    };

    console.log('Sending registration request:', registerRequest); // Debugging

    this.http.post('http://localhost:9393/api/users/register', registerRequest).subscribe({
      next: (response: any) => {
        console.log('Registration successful! Response:', response); // Debugging
        this.showPopupMessage(response.message || 'Registration successful! Redirecting to login...');
    
        // Redirect to the login page after a short delay
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000); // Redirect after 2 seconds
      },
      error: (error) => {
        console.error('Registration failed! Error:', error); // Debugging
        this.showPopupMessage(error.error?.message || 'Registration failed. Please try again.');
      },
    });
  }

  // Helper function to show the popup message
  showPopupMessage(message: string): void {
    this.popupMessage = message;
    this.showPopup = true;

    // Hide the popup after 3 seconds
    setTimeout(() => {
      this.showPopup = false;
    }, 3000);
  }
}