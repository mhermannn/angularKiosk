import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../enviroments/enviroments';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  standalone: true,
})
export class RegisterComponent {
  public registerForm: FormGroup;
  public showPopup = false; 
  public popupMessage = ''; 

  public constructor(
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  public onSubmit(): void {
    if (this.registerForm.invalid) {
      this.showPopupMessage('Please fill out the form correctly.');

      return;
    }

    const registerRequest: { username: string; password: string } = {
      username: this.registerForm.value.username as string,
      password: this.registerForm.value.password as string,
    };

    console.log('Sending registration request:', registerRequest); 

    this.http.post<{ message: string }>(`${environment.apiUrl}/users/register`, registerRequest).subscribe({
      next: (response) => {
        console.log('Registration successful! Response:', response);
        this.showPopupMessage(response.message || 'Registration successful! Redirecting to login...');
    
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000); 
      },
      error: (error: { error?: { message?: string } }) => {
        console.error('Registration failed! Error:', error); 
        this.showPopupMessage(error.error?.message || 'Registration failed. Please try again.');
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
