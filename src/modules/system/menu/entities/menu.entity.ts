import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Role } from '../../role/entities/role.entity'
import { DateFormat } from '@/common/decorators'

@Entity('sys_menu')
@Index(['parentId', 'sort'])
@Index(['menuType'])
@Index(['status'])
@Index(['perms'])
export class Menu {
  @PrimaryGeneratedColumn({ comment: '菜单ID' })
  id: number

  @Column({
    length: 50,
    comment: '菜单名称',
  })
  title: string

  @Column({
    default: 0,
    comment: '父菜单ID',
  })
  parentId: number

  @Column({
    type: 'enum',
    enum: ['directory', 'page', 'permission'],
    default: 'directory',
    comment: '菜单类型（directory目录 page菜单 permission权限）',
  })
  menuType: 'directory' | 'page' | 'permission'

  @Column({
    type: 'int',
    default: 0,
    comment: '显示顺序',
  })
  sort: number

  @Column({
    length: 200,
    default: '',
    comment: '路由地址',
  })
  path: string

  @Column({
    length: 255,
    default: '',
    comment: '组件路径',
  })
  component: string

  @Column({
    length: 200,
    default: '',
    comment: '高亮菜单路径',
  })
  activePath: string

  @Column({
    length: 100,
    default: '',
    comment: '菜单图标',
  })
  icon: string

  @Column({
    length: 100,
    default: '',
    comment: '国际化标识Key',
  })
  i18nKey: string

  @Column({
    type: 'boolean',
    default: true,
    comment: '菜单显示状态',
  })
  menuVisible: boolean

  @Column({
    type: 'boolean',
    default: true,
    comment: '标签栏显示状态',
  })
  tabVisible: boolean

  @Column({
    type: 'boolean',
    default: false,
    comment: '是否固定标签页',
  })
  pinTab: boolean

  @Column({
    type: 'boolean',
    default: false,
    comment: '是否为外链',
  })
  isLink: boolean

  @Column({
    length: 500,
    default: '',
    comment: '外链地址',
  })
  linkPath: string

  @Column({
    type: 'boolean',
    default: false,
    comment: '是否缓存',
  })
  keepAlive: boolean

  @Column({
    length: 100,
    default: '',
    comment: '权限标识',
  })
  perms: string

  @Column({
    type: 'smallint',
    default: 0,
    comment: '菜单状态（0正常 1停用）',
  })
  status: number

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

  // 角色关联（多对多）
  @ManyToMany(() => Role, role => role.menus)
  roles: Role[]
}
