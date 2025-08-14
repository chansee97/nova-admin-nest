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
import { Permission } from '@/modules/permission/entities/permission.entity'

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 20,
  })
  name: string

  @Column({ nullable: true })
  notes: string // 备注

  @CreateDateColumn()
  createTime: Date

  @UpdateDateColumn()
  updateTime: Date

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'role_permission_relation',
  })
  permissions: Permission[]

  @ManyToMany(() => Menu)
  @JoinTable({
    name: 'role_menu_relation',
  })
  menus: Menu[]
}
