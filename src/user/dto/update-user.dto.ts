import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto {
  id: number;
  email: string;
  phone: string;
  password: string;
  name: string;
}
