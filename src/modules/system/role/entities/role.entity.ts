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

@Entity('sys_role')
export class Role {
  @PrimaryGeneratedColumn({ comment: '角色ID' })
  roleId: number

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
    type: 'int',
    default: 0,
    comment: '显示顺序',
  })
  sort: number

  @Column({
    type: 'smallint',
    default: 0,
    comment: '角色状态（0正常 1停用）',
  })
  roleStatus: number

  @Column({
    length: 64,
    default: '',
    comment: '创建者',
  })
  createBy: string

  @CreateDateColumn({
    comment: '创建时间',
  })
  createTime: Date

  @Column({
    length: 64,
    default: '',
    comment: '更新者',
  })
  updateBy: string

  @UpdateDateColumn({
    comment: '更新时间',
  })
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
}
