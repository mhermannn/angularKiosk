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
  standalone: true,
})
export class UserAccountComponent {
  public showDeleteConfirmation = false; 
  public showEditModal = false;
  public editUser = { username: '', password: '' }; 

  public constructor(public authService: AuthService, private router: Router, private http: HttpClient) {}

  public goBack(): void {
    this.router.navigate(['/meal-list']);
  }

  public confirmDelete(): void {
    this.showDeleteConfirmation = true;
  }

  public cancelDelete(): void {
    this.showDeleteConfirmation = false;
  }

  public deleteAccount(): void {
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

  public openEditModal(): void {
    this.editUser = { username: this.authService.getCurrentUser() || '', password: '' }; 
    this.showEditModal = true;
  }

  public closeEditModal(): void {
    this.showEditModal = false;
  }

  public saveChanges(): void {
    const userId = this.authService.getCurrentUserId();
    if (userId === null) {
      alert('User ID not found. Please log in again.');
      
      return;
    }
  
    const token = localStorage.getItem('token'); 
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); 
    
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
