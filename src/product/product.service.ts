import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DataSource, Repository } from 'typeorm';
import { CategoryService } from 'src/category/category.service';
import { Discount } from 'src/discount/entities/discount.entity';
import { BrandService } from 'src/brand/brand.service'
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager'

@Injectable()
export class ProductService {
  constructor(
    private categoryService: CategoryService,
    private brandService: BrandService,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}
  async create(createProductDto: CreateProductDto) {
    const newProduct = {
      brand: createProductDto.brand,
      model: createProductDto.model,
      category: createProductDto.category,
      price: createProductDto.price,
      description: createProductDto.description,
      image: createProductDto.image,
      extra_parameters: createProductDto.extra_parameters,
    };

    if (!newProduct) throw new NotFoundException();
    
    const product = await this.productRepository.save(newProduct);
    await this.cacheManager.del('products')
    return product  
  }

  async findAll() {
    return await this.productRepository.find({
      relations: { brand: true, category: true, discount: true },
    });
  }

  async findOne(id: number) {
    try {
      return await this.productRepository.find({
        relations: { brand: true, category: true, discount: true },
        where: { id },
      });
    } catch {
      throw new NotFoundException('Не найдены товары для скидки');
    }
  }

  async findOneWithoutRelation(id: number) {
    return await this.productRepository.findOne({where: {id}, relations: {brand: true}})
  } 

  async update(id: number, createProductDto: CreateProductDto) {
    
    const update = await this.productRepository.update(id, createProductDto);
    await this.cacheManager.del('products')
    return update
  }

  async remove(id: number) {
    const product = await this.productRepository.find({
      where: { id },
    });
    return await this.productRepository.remove(product);
  }

  async findByBrand(brandId: number) {
    try {
      const products = await this.productRepository.find({
        where: { brand: await this.brandService.findOne(brandId) },
        relations: {discount: true}
      });
      return products;
    } catch (e) {
      throw new NotFoundException(e, 'Не найдены товары для применения скидки');
    }
  }

    async findByCategory(categoryId: number) {
      try {
        const products = await this.productRepository.find({
          where: { category: await this.categoryService.findOne(categoryId) },
          relations: {discount: true}
        });
        return products;
      } catch (e) {
        throw new NotFoundException(e, 'Не найдены товары для применения скидки');
      }
    }

  async createDiscount(
    id: number,
    discount: Discount,
    discountType: string,
  ) {

    const typeSelect = async() => {
      if(discountType == "category") {
        return await this.findByCategory(id)
      }
      if(discountType == "brand") {
        return await this.findByBrand(id)
      }
      if(discountType == "one") {
        return await this.findOne(id)
      }
    }

    const products = (await typeSelect()).filter(
      (product) => {
        if (product.discount) {
          if (product.discount.discount_value < discount.discount_value) {
            return true;
          }
        }
        else {
          return true
        }
      },
    );
    console.log(products);
    
    try {
      return await this.productRepository.update(
        (products.map((product) => product.id)),
        { discount: discount },
      );
    } catch (e) {
      throw new NotFoundException('Не найдены товары для применения скидки1');
    }
  }
}
