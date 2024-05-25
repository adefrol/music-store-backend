import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { TypeOrmModule } from '@nestjs/typeorm'
import { Purchase } from './entities/purchase.entity'
import { PurchaseDetails } from './entities/purchase-details.entity'
import { ProductModule } from 'src/product/product.module'

@Module({
  controllers: [PurchaseController],
  providers: [PurchaseService],
  imports: [TypeOrmModule.forFeature([Purchase, PurchaseDetails]), ProductModule]
})
export class PurchaseModule {}
