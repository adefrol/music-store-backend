import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Banner {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    image: string

    @Column()
    expired_at: Date
}
