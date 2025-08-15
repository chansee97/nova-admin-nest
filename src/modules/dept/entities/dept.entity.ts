import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from '@/modules/user/entities/user.entity'

@Entity('sys_dept')
@Index('idx_dept_parent_sort', ['parentId', 'sort'])
@Index('idx_dept_status', ['status'])
export class Dept {
  @PrimaryGeneratedColumn({
    name: 'dept_id',
    comment: '部门ID',
  })
  deptId: number

  @Column({
    name: 'parent_id',
    type: 'integer',
    default: 0,
    comment: '父部门ID',
  })
  parentId: number

  @Column({
    name: 'ancestors',
    length: 50,
    default: '',
    comment: '祖级列表',
  })
  ancestors: string

  @Column({
    name: 'dept_name',
    length: 30,
    default: '',
    comment: '部门名称',
  })
  deptName: string

  @Column({
    type: 'integer',
    default: 0,
    comment: '显示顺序',
  })
  sort: number

  @Column({
    length: 11,
    default: '',
    comment: '负责人',
  })
  leader: string

  @Column({
    length: 11,
    default: '',
    comment: '联系电话',
  })
  phone: string

  @Column({
    length: 50,
    default: '',
    comment: '邮箱',
  })
  email: string

  @Column({
    type: 'smallint',
    default: 1,
    comment: '部门状态（0停用 1正常）',
  })
  status: number

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
    comment: '删除标志（0未删除 1已删除）',
  })
  delFlag: number

  // 一个部门可以有多个用户
  @OneToMany(() => User, user => user.dept)
  users: User[]
}
