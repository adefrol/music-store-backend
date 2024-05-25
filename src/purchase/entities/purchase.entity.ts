import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PurchaseDetails } from './purchase-details.entity';

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @Column()
  payType: string;

  @Column()
  status: string;

  @Column()
  sum: number

  @ManyToOne(() => User, (user) => user.purchases, {
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'user' })
  user: User;

  @OneToMany(
    () => PurchaseDetails,
    (purchaseDetails) => purchaseDetails.purchase,
    { cascade: true },
  )
  purchaseDetails: PurchaseDetails[];

  @CreateDateColumn()
  created_at: Date;
}
