import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export const GetToken = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    try {
      
      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN);
      }
      return token;
    } catch (e) {
      throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN);
    }

  },
);
