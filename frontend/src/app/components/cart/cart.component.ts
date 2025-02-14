import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MealDto } from '../../shared/models/meal.dto';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  standalone: true,
})
export class CartComponent implements OnInit {
  public cartItems: { name: string; price: string }[] = [];
  public totalPrice = 0;

  public constructor(
    public orderService: OrderService,
    private router: Router,
    private http: HttpClient
  ) {}

  public ngOnInit(): void {
    this.loadCartItems();
  }

  private loadCartItems(): void {
    const order = this.orderService.getCurrentOrder();
    if (order) {
      order.shoppingCart.forEach((mealName) => {
        this.http.get<MealDto[]>('http://localhost:9393/api/meals').subscribe((meals) => {
          const meal = meals.find((m) => m.name === mealName);
          if (meal) {
            this.cartItems.push({ name: meal.name, price: meal.price });
            this.totalPrice += parseFloat(meal.price);
          }
        });
      });
    }
  }

  public goBack(): void {
    this.router.navigate(['/meal-list']);
  }
}
