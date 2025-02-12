// header.component.ts
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
})
export class HeaderComponent {
  constructor(
    public authService: AuthService,
    public orderService: OrderService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout();
  }

  goToUserAccount() {
    this.router.navigate(['/user-account']);
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  getCartItemCount(): number {
    const order = this.orderService.getCurrentOrder();
    return order ? order.shoppingCart.length : 0;
  }
}