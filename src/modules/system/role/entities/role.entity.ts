import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm'
import { Menu } from '@/modules/system/menu/entities/menu.entity'
import { User } from '@/modules/system/user/entities/user.entity'
import { Dept } from '@/modules/system/dept/entities/dept.entity'
import { DateFormat } from '@/common/decorators'

@Entity('sys_role')
export class Role {
  @PrimaryGeneratedColumn({ comment: '角色ID' })
  id: number

  @Column({
    length: 64,
    comment: '角色名称',
  })
  roleName: string

  @Column({
    length: 100,
    unique: true,
    comment: '角色权限字符串',
  })
  roleKey: string

  @Column({
    type: 'smallint',
    default: 0,
    comment: '角色状态（0正常 1停用）',
  })
  status: number

  @Column({
    type: 'smallint',
    default: 1,
    comment:
      '数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限 5：仅本人数据权限）',
  })
  dataScope: number

  @CreateDateColumn({
    comment: '创建时间',
  })
  @DateFormat()
  createTime: Date

  @UpdateDateColumn({
    comment: '更新时间',
  })
  @DateFormat()
  updateTime: Date

  @Column({
    length: 500,
    default: '',
    comment: '备注',
  })
  remark: string

  @DeleteDateColumn({
    comment: '删除时间',
    nullable: true,
  })
  @DateFormat()
  deletedAt: Date | null

  // 角色拥有的菜单权限（多对多）
  @ManyToMany(() => Menu, menu => menu.roles)
  @JoinTable({
    name: 'sys_role_menu',
  })
  menus: Menu[]

  // 用户关联（多对多）
  @ManyToMany(() => User, user => user.roles)
  users: User[]

  // 角色关联的部门（多对多）- 用于数据权限控制
  @ManyToMany(() => Dept, dept => dept.roles)
  @JoinTable({
    name: 'sys_role_dept',
  })
  depts: Dept[]
}
