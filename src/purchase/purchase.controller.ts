import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post()
  create(@Body() createPurchaseDto: CreatePurchaseDto) {
    return this.purchaseService.create(createPurchaseDto);
  }

  @UseGuards(RolesGuard)
  @Get()
  findAll() {
    return this.purchaseService.findAll();
  }

  @UseGuards(RolesGuard)
  @Patch()
  update(@Body() updatePurchaseDto: UpdatePurchaseDto) {
    return this.purchaseService.update(updatePurchaseDto);
  }
}
