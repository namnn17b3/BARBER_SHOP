export class PaymentRequestDto {
  orderUUID?: string | undefined;
  amount: number;
  orderId?: number | undefined;
}
