import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Menu } from '@/modules/menu/entities/menu.entity'
import { User } from '@/modules/user/entities/user.entity'

@Entity('sys_role')
export class Role {
  @PrimaryGeneratedColumn({ name: 'role_id', comment: '角色ID' })
  id: number

  @Column({
    name: 'role_name',
    length: 64,
    comment: '角色名称',
  })
  name: string

  @Column({
    name: 'role_key',
    length: 100,
    unique: true,
    comment: '角色权限字符串',
  })
  roleKey: string

  @Column({
    type: 'int',
    comment: '显示顺序',
  })
  sort: number

  @Column({
    name: 'role_status',
    type: 'smallint',
    default: 1,
    comment: '角色状态（0停用 1正常）',
  })
  roleStatus: number

  @Column({
    name: 'create_by',
    length: 64,
    default: '',
    comment: '创建者',
  })
  createBy: string

  @CreateDateColumn({
    name: 'create_time',
    comment: '创建时间',
  })
  createTime: Date

  @Column({
    name: 'update_by',
    length: 64,
    default: '',
    comment: '更新者',
  })
  updateBy: string

  @UpdateDateColumn({
    name: 'update_time',
    comment: '更新时间',
  })
  updateTime: Date

  @Column({
    length: 500,
    nullable: true,
    comment: '备注',
  })
  remark: string

  @Column({
    name: 'del_flag',
    type: 'smallint',
    default: 0,
    comment: '删除标志（0代表存在 1代表删除）',
  })
  delFlag: number

  // 角色拥有的菜单权限（多对多）
  @ManyToMany(() => Menu, menu => menu.roles)
  @JoinTable({
    name: 'sys_role_menu',
    joinColumn: { name: 'role_id' },
    inverseJoinColumn: { name: 'menu_id' },
  })
  menus: Menu[]

  // 用户关联（多对多）
  @ManyToMany(() => User, user => user.roles)
  users: User[]
}
