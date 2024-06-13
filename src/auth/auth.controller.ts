import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Get,
  UseInterceptors,
  Query,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UsersService } from 'src/user/user.service';
import { RolesGuard } from './guards/roles.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetToken } from './decorators/token.decorator';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from 'src/user/dto/update-user.dto'

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, string>) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  @UsePipes(new ValidationPipe())
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @Get('profile')
  getProfile(@GetToken() token: string) {
    return this.authService.getProfile(token);
  }
  @Get('purchases')
  getProfilePurchases(@GetToken() token: string) {
    return this.authService.getProfileRelation(token);
  }

  @Get('users')
  findAll() {
    return this.userService.findAll();
  }

  @Post('verify')
  acceptVerifyEmail(
    @Query('email') email: string,
    @Query('code') code: string,
  ) {
    return this.userService.acceptVerifyEmail(code, email);
  }

  @Post('recovery-request')
  requestRecovery(@GetToken() token: string) {
    return this.userService.requestRecoverPass(token);
  }

  @Post('recovery-accept')
  acceptRecovery(
    @Query('code') code: string,
    @GetToken() token: string,
    @Query('pass') newPassword: string,
  ) {
    return this.userService.acceptRecoveryPass(code, token, newPassword);
  }

  @UseGuards(RolesGuard)
  @Get('admin')
  async isAdmin() {
    return { status: 200 };
  }

  @UseGuards(JwtAuthGuard)
  @Get('isLogin')
  async isLogged() {
    return { status: 200 };
  }

  @UseGuards(JwtAuthGuard)
  @Post('edit')
  async edit(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto)
  }
}
