import { Injectable } from '@nestjs/common';
import {
  CreatePurchaseDetailsDto,
  CreatePurchaseDto,
} from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Purchase } from './entities/purchase.entity';
import { Repository } from 'typeorm';
import { PurchaseDetails } from './entities/purchase-details.entity';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(Purchase)
    private purchaseRepository: Repository<Purchase>,
    @InjectRepository(PurchaseDetails)
    private purchaseDetailsRepository: Repository<PurchaseDetails>,
    private productService: ProductService,
  ) {}

  async create(createPurchaseDto: CreatePurchaseDto) {
    const newPurchase = createPurchaseDto;
    const { products, ...withoutProducts } = newPurchase;

    const createdPurchase = await this.purchaseRepository.save(withoutProducts);

    products.forEach(async (product) => {
      await this.purchaseDetailsRepository.save({ 
        purchase: createdPurchase,
        product: await this.productService.findOneWithoutRelation(
          product.product,
        ),
        count: product.count,
      });
    });

    return await this.purchaseRepository.findOne({
      where: { id: createdPurchase.id },
      relations: {
        user: true,
        purchaseDetails: { product: true },
      },
    });
  }

  async findAll() {
    return await this.purchaseRepository.find({
      relations: { user: true, purchaseDetails: { product: { brand: true } } },
    });
  }

  async findOne(id: number) {
    return await this.purchaseRepository.findOne({where : {id}});
  }

  async update(updatePurchaseDto: UpdatePurchaseDto) {
    const purchase = await this.findOne(updatePurchaseDto.id)
    return await this.purchaseRepository.save({...purchase, status: updatePurchaseDto.status});
  }

  remove(id: number) {
    return `This action removes a #${id} purchase`;
  }
}
