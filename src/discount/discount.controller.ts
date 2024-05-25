import { Controller, Get, Post, Body, Patch, Param, Delete, Query, NotFoundException, UseGuards } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard'

@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @UseGuards(RolesGuard)
  @Post()
  create(@Body() createDiscountDto: CreateDiscountDto) {
      return this.discountService.create(createDiscountDto);
  }

  @UseGuards(RolesGuard)
  @Get()
  findAll() {
    return this.discountService.findAll();
  }

  @UseGuards(RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.discountService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDiscountDto: UpdateDiscountDto) {
    return this.discountService.update(+id, updateDiscountDto);
  }

  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.discountService.remove(+id);
  }
}
