import { Brand } from 'src/brand/entities/brand.entity'
import { Product } from 'src/product/entities/product.entity'
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn({ name: 'category_id' })
  id: number;

  @Column()
  name: string;

  @Column()
  subcategory: string;

  @OneToMany(() => Product, (product) => product.category, {
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'product' })
  product: Product[];

  @ManyToMany(() => Brand, (brand) => brand.categories)
  @JoinTable()
  brands: Brand[]
}
