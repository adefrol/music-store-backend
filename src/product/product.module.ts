import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm'
import { Product } from './entities/product.entity'
import { UsersModule } from 'src/user/user.module'
import { CategoryModule } from 'src/category/category.module'
import { BrandModule } from 'src/brand/brand.module'

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [TypeOrmModule.forFeature([Product]), CategoryModule, BrandModule],
  exports: [ProductService]
})
export class ProductModule {}
