import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from '@/modules/system/user/entities/user.entity'
import { DateFormat } from '@/common/decorators'

@Entity('sys_dept')
@Index(['parentId', 'sort'])
@Index(['status'])
export class Dept {
  @PrimaryGeneratedColumn({
    comment: '部门ID',
  })
  deptId: number

  @Column({
    type: 'integer',
    default: 0,
    comment: '父部门ID',
  })
  parentId: number

  @Column({
    length: 50,
    default: '',
    comment: '祖级列表',
  })
  ancestors: string

  @Column({
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
    default: 0,
    comment: '部门状态（0正常 1停用）',
  })
  status: number

  @Column({
    length: 64,
    default: '',
    comment: '创建者',
  })
  createBy: string

  @CreateDateColumn({
    comment: '创建时间',
  })
  @DateFormat()
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
  @DateFormat()
  updateTime: Date

  @Column({
    length: 500,
    default: '',
    comment: '备注',
  })
  remark: string

  // 一个部门可以有多个用户
  @OneToMany(() => User, user => user.dept)
  users: User[]
}
