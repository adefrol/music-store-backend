import { Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express'
import { write } from 'fs'
import { Express } from 'express'
import { RolesGuard } from './auth/guards/roles.guard'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(RolesGuard)
  @Get()
  hello() {
    return "Hello world";
  }

}
