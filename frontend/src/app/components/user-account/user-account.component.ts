import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-account',
  imports: [],
  templateUrl: './user-account.component.html',
  styleUrl: './user-account.component.scss'
})
export class UserAccountComponent {
  constructor(public authService: AuthService, private router: Router) {}
  goBack(): void {
    this.router.navigate(['/meal-list']);
  }

}
