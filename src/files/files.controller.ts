import {
  BadRequestException,
  Controller,
  HttpException,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { stat, writeFile } from 'fs';
import { join } from 'path';
import { RolesGuard } from 'src/auth/guards/roles.guard'

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseGuards(RolesGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
    @Query('folder')
    folder: string
  ) {
    const fileName = await this.filesService.saveFile(file, folder);
    return { fileName: `${folder}/${fileName}`, status: 200 };
  }
}
