import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { Brand } from './entities/brand.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  controllers: [BrandController],
  providers: [BrandService],
  imports: [TypeOrmModule.forFeature([Brand])],
  exports: [BrandService]
})
export class BrandModule {}
