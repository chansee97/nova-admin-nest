import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthService } from '@/modules/auth/auth.service'
import { UserModule } from '@/modules/user/user.module'
import { PermissionGuard } from '../permission/permission.guard'
import { Permission } from './entities/permission.entity'
import { PermissionController } from './permission.controller'
import { PermissionService } from './permission.service'

@Module({
  controllers: [PermissionController],
  providers: [
    PermissionService,
    AuthService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
  imports: [UserModule, TypeOrmModule.forFeature([Permission])],
})
export class PermissionModule {}
