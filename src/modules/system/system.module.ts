import { Module } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { RoleModule } from './role/role.module'
import { MenuModule } from './menu/menu.module'
import { DeptModule } from './dept/dept.module'
import { DictModule } from './dict/dict.module'

/**
 * 系统管理模块
 * 包含用户、角色、菜单、部门、字典等系统基础功能
 */
@Module({
  imports: [UserModule, RoleModule, MenuModule, DeptModule, DictModule],
  exports: [UserModule, RoleModule, MenuModule, DeptModule, DictModule],
})
export class SystemModule {}
