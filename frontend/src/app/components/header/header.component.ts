import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true
})
export class HeaderComponent {
  public constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  public logout(): void {
    this.authService.logout();
  }


  public goToAdmin(): void {
    this.router.navigate(['/admin']);
  }
}
