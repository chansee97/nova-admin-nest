import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from '@/modules/auth/auth.module'
import { UserModule } from '@/modules/user/user.module'
import { PermissionGuard } from '../permission/permission.guard'
import { Permission } from './entities/permission.entity'
import { PermissionController } from './permission.controller'
import { PermissionService } from './permission.service'

@Module({
  controllers: [PermissionController],
  providers: [PermissionService, PermissionGuard],
  imports: [AuthModule, UserModule, TypeOrmModule.forFeature([Permission])],
  exports: [PermissionGuard],
})
export class PermissionModule {}
