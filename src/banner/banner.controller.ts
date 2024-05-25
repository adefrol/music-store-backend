import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, Inject } from '@nestjs/common';
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager'

@Controller('banner')

@UseInterceptors(CacheInterceptor)
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @UseGuards(RolesGuard)
  @Post()
  create(@Body() createBannerDto: CreateBannerDto) {
    return this.bannerService.create(createBannerDto);
  }

  @Get()
  @CacheKey('banner')
  findAll() {
    return this.bannerService.findAll();
  }

  @Get('cache')
  findCache() {
    return this.bannerService.findCache();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bannerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBannerDto: UpdateBannerDto) {
    return this.bannerService.update(+id, updateBannerDto);
  }

  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bannerService.remove(+id);
  }
}
