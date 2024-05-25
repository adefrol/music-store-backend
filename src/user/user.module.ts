
/* import { usersProviders } from './users.providers' */

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from 'src/auth/constants'
import { UsersService } from './user.service'
import { MailModule } from 'src/mail/mail.module'

@Module({
  imports: [MailModule,TypeOrmModule.forFeature([User]), JwtModule.register({
    global: true,
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '7d' },
  }),],
  exports: [UsersService],
  providers: [UsersService],
})
export class UsersModule { }  
