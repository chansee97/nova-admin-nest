import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Role } from '../role/entities/role.entity'
import { User } from './entities/user.entity'
import { Menu } from '../menu/entities/menu.entity'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { config } from '@/config'

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    TypeOrmModule.forFeature([User, Role, Menu]),
    JwtModule.register({
      secret: config.jwt.secret,
    }),
  ],
  exports: [UserService],
})
export class UserModule {}
