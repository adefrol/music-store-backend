import {
  BadRequestException,
  ConflictException,
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }
  async findOneById(id: number): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findOneByIdRelations(id: number): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        purchases: {
          purchaseDetails: {
            product: { brand: true },
          },
        },
      },
    });
  }

  async register(createUserDto: CreateUserDto) {
    const existUser = await this.findOne(createUserDto.email);

    if (existUser) {
      throw new HttpException(
        'Пользователь с таким e-mail или логином уже существует',
        HttpStatus.CONFLICT,
      );
    }

    const user = await this.userRepository.save({
      email: createUserDto.email,
      name: createUserDto.name,
      phone: createUserDto.phone,
      password: createUserDto.password,
      /* register_code: Math.floor(100000 + Math.random() * 900000).toString(),
      recovery_code: Math.floor(100000 + Math.random() * 900000).toString() */
    });
    this.verifyEmail(user.id);
    return { user, statusCode: 200 };
  }

  async update(updateUserDto: UpdateUserDto) {
    const user = await this.findOneById(updateUserDto.id);

    return await this.userRepository.save({
      id: user.id,
      email: updateUserDto.email,
      name: updateUserDto.name,
      phone: updateUserDto.phone,
      password: updateUserDto.password,
    });
  }

  async verifyEmail(id: number) {
    const user = await this.findOneById(id);

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      const update = await this.userRepository.save({
        ...user,
        register_code: code,
      });
      console.log(update);
    } catch {
      throw new HttpException('Aboba', HttpStatus.CONFLICT);
    }

    return await this.mailService.sendMailRegister(user.email, code);
  }

  async requestRecoverPass(token: string) {
    const id = this.jwtService.verify(token).id;

    const user = await this.findOneById(id);

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await this.userRepository.save({
      ...user,
      recovery_code: code,
    });

    await this.mailService.sendMailRecovery(user.email, code);

    return { status: 200 };
  }

  async acceptVerifyEmail(code: string, email: string) {
    try {
      const userByCode = await this.userRepository.findOne({
        where: {
          register_code: code,
        },
      });
      console.log(userByCode);
      console.log(code);

      const userByEmail = await this.findOne(email);

      if (userByCode.id == userByEmail.id) {
        await this.userRepository.save({ ...userByCode, register_code: null });
        return { status: 200 };
      } else {
        throw new HttpException(
          'Что-то пошло не так',
          HttpStatus.I_AM_A_TEAPOT,
        );
      }
    } catch (e) {
      console.log(e);

      throw new HttpException('Что-то пошло не так', HttpStatus.BAD_REQUEST);
    }
  }

  async acceptRecoveryPass(code: string, token: string, newPassword: string) {
    try {
      const userByToken = this.jwtService.verify(token);

      const userByCode = await this.userRepository.findOne({
        where: {
          recovery_code: code,
        },
      });

      if (userByCode.id == userByToken.id) {
        await this.userRepository.save({
          ...userByCode,
          recovery_code: null,
          password: newPassword,
        });

        return { status: 200 };
      } else {
        throw new HttpException(
          'Что-то пошло не так',
          HttpStatus.I_AM_A_TEAPOT,
        );
      }
    } catch (e) {
      throw new HttpException('Что-то пошло не так', HttpStatus.UNAUTHORIZED);
    }
  }
}
