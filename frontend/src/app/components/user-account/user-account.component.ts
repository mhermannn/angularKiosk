import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-account',
  imports: [FormsModule],
  templateUrl: './user-account.component.html',
  styleUrl: './user-account.component.scss',
})
export class UserAccountComponent {
  showDeleteConfirmation = false; // Controls the visibility of the delete confirmation dialog
  showEditModal = false; // Controls the visibility of the edit modal
  editUser = { username: '', password: '' }; // Stores the edited user data

  constructor(public authService: AuthService, private router: Router, private http: HttpClient) {}

  // Go back to the meal list
  goBack(): void {
    this.router.navigate(['/meal-list']);
  }

  // Open the delete confirmation dialog
  confirmDelete(): void {
    this.showDeleteConfirmation = true;
  }

  // Cancel the delete action
  cancelDelete(): void {
    this.showDeleteConfirmation = false;
  }

  // Delete the user account
  deleteAccount(): void {
    const userId = this.authService.getCurrentUserId();
    if (userId === null) {
      alert('User ID not found. Please log in again.');
      return;
    }

    this.http.delete(`http://localhost:9393/api/users/${userId}`).subscribe({
      next: () => {
        alert('Account deleted successfully.');
        this.authService.logout(); // Log out the user after deleting the account
        this.router.navigate(['/']); // Redirect to the home page
      },
      error: (err) => {
        console.error('Error deleting account:', err);
        alert('Failed to delete account. Please try again.');
      },
    });
  }

  // Open the edit modal
  openEditModal(): void {
    this.editUser = { username: this.authService.getCurrentUser() || '', password: '' }; // Pre-fill the username
    this.showEditModal = true;
  }

  // Close the edit modal
  closeEditModal(): void {
    this.showEditModal = false;
  }

  saveChanges(): void {
    const userId = this.authService.getCurrentUserId();
    if (userId === null) {
      alert('User ID not found. Please log in again.');
      return;
    }
  
    const token = localStorage.getItem('token'); // Get the token from localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // Add the token to the headers
    // this.http.put(`http://localhost:9393/api/users/${userId}`, this.editUser).subscribe({
    //   next: () => {
    //     alert('User details updated successfully.');
    //     this.closeEditModal();
  
    //     // Update the current username in AuthService
    //     this.authService.setCurrentUser(this.editUser.username);
    //   },
    //   error: (err) => {
    //     console.error('Error updating user details:', err);
    //     alert('Failed to update user details. Please try again.');
    //   },
    // });
    this.http.put(`http://localhost:9393/api/users/${userId}`, this.editUser, { headers }).subscribe({
      next: () => {
        alert('User details updated successfully.');
        this.closeEditModal();
        this.authService.setCurrentUser(this.editUser.username); // Update the current username in AuthService
      },
      error: (err) => {
        console.error('Error updating user details:', err);
        alert('Failed to update user details. Please try again.');
      },
    });
  }
}