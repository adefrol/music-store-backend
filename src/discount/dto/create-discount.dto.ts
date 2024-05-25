import { Double } from 'typeorm'

export class CreateDiscountDto {
  name: string;
  discount_value: number;
  expired_at: Date;
  type: string;
  target: number
}
