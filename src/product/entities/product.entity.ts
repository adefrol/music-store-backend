import { Brand } from 'src/brand/entities/brand.entity';
import { Category } from 'src/category/entities/category.entity';
import { Discount } from 'src/discount/entities/discount.entity'
import { PurchaseDetails } from 'src/purchase/entities/purchase-details.entity'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn({ name: 'product_id' })
  id: number;

  @ManyToOne(() => Brand, (brand) => brand.product, {
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'brand' })
  brand: Brand;

  @Column()
  model: string;

  @ManyToOne(() => Category, (category) => category.product, {
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'category' })
  category: Category;

  @ManyToOne(() => Discount, (discount) => discount.product, {onDelete: "SET NULL", nullable: true})
  @JoinColumn({name: 'discount'})
  discount: Discount

  @OneToMany(
    () => PurchaseDetails,
    (purchaseDetails) => purchaseDetails.product,
  )
  purchaseDetails: PurchaseDetails[];

  @Column()
  price: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column()
  extra_parameters: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
