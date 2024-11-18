export class PaymentRequestDto {
  orderUUID?: string | undefined;
  amount: number;
  orderId?: number | undefined;
  hairStyleId?: number | undefined;
  userId?: number | undefined;
}
