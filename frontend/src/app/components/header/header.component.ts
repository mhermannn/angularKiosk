import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
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
    public orderService: OrderService,
    private router: Router
  ) {}

  public logout(): void {
    this.authService.logout();
  }

  public goToUserAccount(): void {
    this.router.navigate(['/user-account']);
  }

  public goToCart(): void {
    this.router.navigate(['/cart']);
  }

  public getCartItemCount(): number {
    const order = this.orderService.getCurrentOrder();
    
    return order ? order.shoppingCart.length : 0;
  }

  public goToAdmin(): void {
    this.router.navigate(['/admin']);
  }
}
