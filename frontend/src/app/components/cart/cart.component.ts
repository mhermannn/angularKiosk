import { Component } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Meal {
  id: number;
  name: string;
  price: string;
}

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  cartItems: { name: string; price: string }[] = [];
  totalPrice: number = 0;

  constructor(
    public orderService: OrderService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    const order = this.orderService.getCurrentOrder();
    if (order) {
      order.shoppingCart.forEach((mealName) => {
        this.http.get<Meal[]>('http://localhost:9393/api/meals').subscribe((meals) => {
          const meal = meals.find((m) => m.name === mealName);
          if (meal) {
            this.cartItems.push({ name: meal.name, price: meal.price });
            this.totalPrice += parseFloat(meal.price);
          }
        });
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/meal-list']);
  }

}