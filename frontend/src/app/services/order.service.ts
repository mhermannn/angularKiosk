// order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

export interface Order {
  orderId: number;
  customerId: number;
  orderType: 'TO_GO' | 'ON_SITE' | 'UNKNOWN';
  orderStatus: 'NEW' | 'COMPLETED' | 'CANCELLED' | 'IN_PROGRESS';
  orderPaymentType: 'CARD' | 'CASH' | 'TRANSFER' | 'UNKNOWN';
  shoppingCart: string[];
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private currentOrderSubject = new BehaviorSubject<Order | null>(null);
  public currentOrder$ = this.currentOrderSubject.asObservable();

  constructor(private http: HttpClient) {}

  createOrder(customerId: number): void {
    const newOrder: Order = {
      orderId: 0, // Will be assigned by the backend
      customerId,
      orderType: 'UNKNOWN',
      orderStatus: 'NEW',
      orderPaymentType: 'UNKNOWN',
      shoppingCart: [],
      createdAt: new Date().toISOString(),
    };

    this.http.post<Order>('http://localhost:9393/api/orders', newOrder).subscribe((order) => {
      this.currentOrderSubject.next(order);
    });
  }

  updateOrder(order: Order): void {
    this.http.put<Order>(`http://localhost:9393/api/orders/${order.orderId}`, order).subscribe((updatedOrder) => {
      this.currentOrderSubject.next(updatedOrder);
    });
  }

  addToCart(mealName: string): void {
    const currentOrder = this.currentOrderSubject.value;
    if (currentOrder) {
      currentOrder.shoppingCart.push(mealName);
      currentOrder.orderStatus = 'IN_PROGRESS';
      this.updateOrder(currentOrder);
    }
  }

  getCurrentOrder(): Order | null {
    return this.currentOrderSubject.value;
  }
}