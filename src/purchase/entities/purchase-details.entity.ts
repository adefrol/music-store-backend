import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Purchase } from './purchase.entity';
import { Product } from 'src/product/entities/product.entity';

@Entity()
export class PurchaseDetails {
  @PrimaryGeneratedColumn()
  id: number;

   @ManyToOne(() => Purchase, (purchase) => purchase.purchaseDetails, {
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'purchase' })
  purchase: Purchase;

  @ManyToOne(() => Product, (product) => product.purchaseDetails, {
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'product' })
  product: Product; 

  @Column()
  count: number
}
