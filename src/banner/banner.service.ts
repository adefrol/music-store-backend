import { Inject, Injectable } from '@nestjs/common';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Banner } from './entities/banner.entity';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private bannerRepository: Repository<Banner>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createBannerDto: CreateBannerDto) {
    const newBanner = {
      image: createBannerDto.image,
      expired_at: createBannerDto.expired_at,
    };
    await this.cacheManager.del('banner');
    return await this.bannerRepository.save(newBanner);
  }

  @Cron(CronExpression.EVERY_HOUR)
  async overdue() {
    console.log('started banner');

    const banners = await this.findAll();
    if (banners != null) {
      banners.forEach((element) => {
        if (element.expired_at.getTime() < new Date(Date.now()).getTime()) {
          this.remove(element.id);
        }
      });
    }
  }

  async findAll() {
    return await this.bannerRepository.find();
  }

  async findOne(id: number) {
    return await this.bannerRepository.find({ where: { id } });
  }

  async findCache() {
    return await this.cacheManager.get('banner');
  }

  update(id: number, updateBannerDto: UpdateBannerDto) {
    return `This action updates a #${id} banner`;
  }

  async remove(id: number) {
    await this.cacheManager.del('banner');
    return await this.bannerRepository.remove(await this.findOne(id));
  }
}
