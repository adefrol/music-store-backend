import { BadRequestException, Injectable } from '@nestjs/common';
import { writeFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class FilesService {
  async saveFile(file: Express.Multer.File, folder: string) {
    const validMimetypes = ['image/jpeg', 'image/png'];
    const validSize = 1000 * 1000 * 5; //MBytes
    const staticPath = join(
      __dirname,
      '..',
      '..',
      'public',
      folder
    );

    if (file.size < validSize && validMimetypes.includes(file.mimetype)) {
      const fileName = Date.now().toString() + '-' + file.originalname;
      await writeFile(
        join(staticPath, fileName),
        file.buffer,
      );

      return fileName;
    } else {
      throw new BadRequestException('Ошибка при записи файла');
    }
  }
}
