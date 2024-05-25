import { User } from 'src/user/entities/user.entity';
import { PurchaseDetails } from '../entities/purchase-details.entity';

export class CreatePurchaseDto {
  address: string;
  payType: string;
  status: string;
  user: User;
  products: Products[];
}

export class CreatePurchaseDetailsDto {
  product: number;
  count: number;
}

interface Products {
  product: number;
  count: number;
}
