import { OrderPaymentType } from '../enums/order-payment-type';
import { OrderStatus } from '../enums/order-status';
import { OrderType } from '../enums/order-type';
export interface OrderDto {
  orderId: number;
  customerId: number;
  orderType: OrderType;
  orderStatus: OrderStatus;
  orderPaymentType: OrderPaymentType;
  shoppingCart: string[];
  createdAt: string;
}