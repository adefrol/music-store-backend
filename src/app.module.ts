import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MulterModule } from '@nestjs/platform-express';
import { FilesModule } from './files/files.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { PurchaseModule } from './purchase/purchase.module';
import { UsersModule } from './user/user.module';
import { CartModule } from './cart/cart.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { AuthModule } from './auth/auth.module';
import { BrandModule } from './brand/brand.module';
import { DiscountModule } from './discount/discount.module';
import { CacheModule } from '@nestjs/cache-manager';
import { MailService } from './mail/mail.service';
import { MailerModule } from '@nestjs-modules/mailer'
import { MailController } from './mail/mail.controller';
import { MailModule } from './mail/mail.module';
import { ScheduleModule } from '@nestjs/schedule'
import { BannerModule } from './banner/banner.module';

@Module({
  imports: [
    CacheModule.register({ ttl: 0, isGlobal: true }),
    ScheduleModule.forRoot(),
    MulterModule.register({
      dest: join(__dirname, '..', 'public'),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async(config: ConfigService) => (
        {
          transport: {
            host: "smtp.yandex.ru",
            secure: true,
            port: 465,
            auth: {
              user: "music-store-no-reply@yandex.ru",
              pass: config.get('MAIL_PASSWORD')
            }
          }
        }
      )
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        url: configService.get('DB_URL'),
        type: 'postgres',
        ssl: true,
        synchronize: true,
        entities: [__dirname + '/**/*.entity.{ts,js}'],
      }),
      inject: [ConfigService],
    }),
    FilesModule,
    ProductModule,
    CategoryModule,
    PurchaseModule,
    UsersModule,
    CartModule,
    WishlistModule,
    AuthModule,
    BrandModule,
    DiscountModule,
    MailModule,
    BannerModule,
  ],

  controllers: [AppController, MailController],
  providers: [AppService, MailService],
})
export class AppModule {}
