import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

type token = {
  access_token: string;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async signIn(email: string, pass: any) {
    const user = await this.usersService.findOne(email);
    if (user?.password !== pass) {
      console.log(user);

      throw new UnauthorizedException('Неправильный логин или пароль');
    }
    if (user?.register_code) {
      throw new HttpException('Почта не подтверждена', HttpStatus.FORBIDDEN);
    }
    const payload = { id: user.id, email: user.email, admin: user.admin };
    return {
      access_token: await this.jwtService.signAsync(payload),
      status: 200,
    };
  }

  async getProfile(token: string) {
    try {
      const user = this.jwtService.verify(token);

      return await this.usersService.findOneById(user.id as number);
    } catch {
      throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN);
    }
  }

  async getProfileRelation(token: string) {
    try {
      const user = this.jwtService.verify(token);

      return await this.usersService.findOneByIdRelations(user.id as number);
    } catch {
      throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN);
    }
  }
}
