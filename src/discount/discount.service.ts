import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { ProductService } from 'src/product/product.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Discount } from './entities/discount.entity';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class DiscountService {
  constructor(
    private productService: ProductService,
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createDiscountDto: CreateDiscountDto) {
    const newDiscount = {
      name: createDiscountDto.name,
      discount_value: createDiscountDto.discount_value,
      expired_at: createDiscountDto.expired_at,
      type: createDiscountDto.type,
      target: createDiscountDto.target,
    };
    const createdDiscount = await this.discountRepository.save(newDiscount);
    try {
      const setDiscountProducts = await this.productService.createDiscount(
        createDiscountDto.target,
        createdDiscount,
        createDiscountDto.type,
      );
      await this.cacheManager.del('product');

      return setDiscountProducts
    } catch {
      await this.remove(createdDiscount.id)
      throw new HttpException("", HttpStatus.NOT_FOUND)
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async overdue() {
    console.log('started');

    const discounts = await this.findAll();
    if (discounts != null) {
      discounts.forEach(async (element) => {
        if (element.expired_at.getTime() < new Date(Date.now()).getTime()) {
          this.remove(element.id);
          await this.cacheManager.del('product');
        }
      });
    }
  }

  async findAll() {
    return await this.discountRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} discount`;
  }

  update(id: number, updateDiscountDto: UpdateDiscountDto) {
    return `This action updates a #${id} discount`;
  }

  async remove(id: number) {
    const remove = await this.discountRepository.remove(
      await this.discountRepository.findOne({ where: { id } }),
    );
    await this.cacheManager.del('product');
    return remove
  }
}
