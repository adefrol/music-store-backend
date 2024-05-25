import { Module } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { ProductModule } from 'src/product/product.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Discount } from './entities/discount.entity'

@Module({
  controllers: [DiscountController],
  providers: [DiscountService],
  imports: [ProductModule, TypeOrmModule.forFeature([Discount])]
})
export class DiscountModule {}
