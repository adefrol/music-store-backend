import { Category } from 'src/category/entities/category.entity'
import { Product } from 'src/product/entities/product.entity'
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Brand {
  @PrimaryGeneratedColumn({ name: 'brand_id' })
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Product, (product) => product.brand, {
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'product' })
  product: Product[];


  @ManyToMany(() => Category, (category) => category.brands)
  categories: Category[]

}
