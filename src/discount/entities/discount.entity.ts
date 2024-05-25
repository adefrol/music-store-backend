import { Product } from 'src/product/entities/product.entity'
import { Column, CreateDateColumn, Double, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Discount {
    @PrimaryGeneratedColumn({name: "discount_id"})
    id: number

    @Column()
    name: string

    @Column()
    discount_value: number

    @Column()
    expired_at: Date

    @Column() 
    type: string

    @Column()
    target: number;

    @OneToMany(() => Product, (product) => product.discount)
    @JoinColumn({name: 'product'})
    product: Product[]
}
