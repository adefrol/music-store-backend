import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager'



@Controller('product')
/* @UseInterceptors(CacheInterceptor) */
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(RolesGuard)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  /* @CacheKey("product") */
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOneWithoutRelation(+id);
  }

  @UseGuards(RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() createProductDto: CreateProductDto) {
    return this.productService.update(+id, createProductDto);
  }

  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
