import { Exclude } from 'class-transformer';
import { Purchase } from 'src/purchase/entities/purchase.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  password: string;

  @Column({ nullable: true })
  address: string;

  @Exclude({ toPlainOnly: true })
  @Column({ default: false })
  admin: boolean;

  @OneToMany(() => Purchase, (purchase) => purchase.user, {
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'purchases' })
  purchases: Purchase[];

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  register_code: string;
  
  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  recovery_code: string;
}
