import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { OrderDto } from '../shared/models/order.dto';
import { OrderPaymentType } from '../shared/enums/order-payment-type';
import { OrderStatus } from '../shared/enums/order-status';
import { OrderType } from '../shared/enums/order-type';
@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private currentOrderSubject = new BehaviorSubject<OrderDto | null>(null);
  public currentOrder$ = this.currentOrderSubject.asObservable();

  public constructor(private http: HttpClient) {}

  public createOrder(customerId: number): void {
    const newOrder: OrderDto = {
      orderId: 0, 
      customerId,
      orderType: OrderType.UNKNOWN,
      orderStatus: OrderStatus.NEW,
      orderPaymentType: OrderPaymentType.UNKNOWN,
      shoppingCart: [],
      createdAt: new Date().toISOString(),
    };

    this.http.post<OrderDto>('http://localhost:9393/api/orders', newOrder).subscribe((order) => {
      this.currentOrderSubject.next(order);
    });
  }

  public updateOrder(order: OrderDto): void {
    this.http.put<OrderDto>(`http://localhost:9393/api/orders/${order.orderId}`, order).subscribe((updatedOrder) => {
      this.currentOrderSubject.next(updatedOrder);
    });
  }

  public addToCart(mealName: string): void {
    const currentOrder = this.currentOrderSubject.value;
    if (currentOrder) {
      currentOrder.shoppingCart.push(mealName);
      currentOrder.orderStatus = OrderStatus.IN_PROGRESS;
      this.updateOrder(currentOrder);
    }
  }

  public getCurrentOrder(): OrderDto | null {
    return this.currentOrderSubject.value;
  }
}
