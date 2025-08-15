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

@Entity('sys_menu')
@Index('idx_parent_sort', ['parentId', 'sort'])
@Index('idx_menu_type', ['menuType'])
@Index('idx_status', ['status'])
@Index('idx_perms', ['perms'])
export class Menu {
  @PrimaryGeneratedColumn({ name: 'menu_id', comment: '菜单ID' })
  id: number

  @Column({
    name: 'menu_name',
    length: 50,
    comment: '菜单名称',
  })
  menuName: string

  @Column({
    name: 'parent_id',
    default: 0,
    comment: '父菜单ID',
  })
  parentId: number

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
    nullable: true,
    comment: '组件路径',
  })
  component: string

  @Column({
    name: 'is_frame',
    type: 'smallint',
    default: 0,
    comment: '是否为外链（0否 1是）',
  })
  isFrame: number

  @Column({
    name: 'is_cache',
    type: 'smallint',
    default: 1,
    comment: '是否缓存（0不缓存 1缓存）',
  })
  isCache: number

  @Column({
    name: 'menu_type',
    type: 'enum',
    enum: ['M', 'C', 'F'],
    comment: '菜单类型（M目录 C菜单 F按钮）',
  })
  menuType: 'M' | 'C' | 'F'

  @Column({
    type: 'smallint',
    default: 1,
    comment: '是否显示（0隐藏 1显示）',
  })
  visible: number

  @Column({
    type: 'smallint',
    default: 1,
    comment: '菜单状态（0停用 1正常）',
  })
  status: number

  @Column({
    length: 100,
    default: '',
    comment: '权限标识',
  })
  perms: string

  @Column({
    length: 100,
    default: '#',
    comment: '菜单图标',
  })
  icon: string

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
    default: '',
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

  // 角色关联（多对多）
  @ManyToMany(() => Role, role => role.menus)
  roles: Role[]
}
