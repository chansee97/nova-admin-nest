import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Menu } from '../menu/entities/menu.entity'
import { Dept } from '../dept/entities/dept.entity'
import { Role } from './entities/role.entity'
import { RoleController } from './role.controller'
import { RoleService } from './role.service'

@Module({
  controllers: [RoleController],
  providers: [RoleService],
  imports: [TypeOrmModule.forFeature([Role, Menu, Dept])],
})
export class RoleModule {}
