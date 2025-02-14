import { OrderPaymentType } from '../enums/order-payment-type';
import { OrderStatus } from '../enums/order-status';
import { OrderType } from '../enums/order-type';
export interface OrderDto {
  readonly orderId: number;
  readonly customerId: number;
  readonly orderType: OrderType;
  readonly orderStatus: OrderStatus;
  readonly orderPaymentType: OrderPaymentType;
  readonly shoppingCart: string[];
  readonly createdAt: string;
}