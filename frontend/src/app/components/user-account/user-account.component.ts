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
  showDeleteConfirmation = false; 
  showEditModal = false;
  editUser = { username: '', password: '' }; 

  constructor(public authService: AuthService, private router: Router, private http: HttpClient) {}

  goBack(): void {
    this.router.navigate(['/meal-list']);
  }

  confirmDelete(): void {
    this.showDeleteConfirmation = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirmation = false;
  }

  deleteAccount(): void {
    const userId = this.authService.getCurrentUserId();
    if (userId === null) {
      alert('User ID not found. Please log in again.');
      return;
    }

    this.http.delete(`http://localhost:9393/api/users/${userId}`).subscribe({
      next: () => {
        alert('Account deleted successfully.');
        this.authService.logout(); 
        this.router.navigate(['/']); 
      },
      error: (err) => {
        console.error('Error deleting account:', err);
        alert('Failed to delete account. Please try again.');
      },
    });
  }

  openEditModal(): void {
    this.editUser = { username: this.authService.getCurrentUser() || '', password: '' }; 
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  saveChanges(): void {
    const userId = this.authService.getCurrentUserId();
    if (userId === null) {
      alert('User ID not found. Please log in again.');
      return;
    }
  
    const token = localStorage.getItem('token'); 
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); 
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
        this.authService.setCurrentUser(this.editUser.username); 
      },
      error: (err) => {
        console.error('Error updating user details:', err);
        alert('Failed to update user details. Please try again.');
      },
    });
  }
}