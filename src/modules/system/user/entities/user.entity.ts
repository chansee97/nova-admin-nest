import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Role } from '@/modules/system/role/entities/role.entity'
import { Dept } from '@/modules/system/dept/entities/dept.entity'
import { encryptData } from '@/utils/crypto'

@Entity('sys_user')
@Index(['username'])
@Index(['phone'])
@Index(['email'])
@Index(['userStatus', 'delFlag'])
export class User {
  @PrimaryGeneratedColumn({ comment: '用户ID' })
  userId: number

  @Column({
    type: 'integer',
    nullable: true,
    comment: '部门ID',
  })
  deptId: number

  @Column({
    length: 30,
    unique: true,
    comment: '用户账号',
  })
  username: string

  @Column({
    length: 30,
    comment: '用户昵称',
  })
  nickName: string

  @Column({
    length: 50,
    default: '',
    comment: '用户邮箱',
    nullable: true,
  })
  email: string

  @Column({
    length: 11,
    default: '',
    comment: '手机号码',
    nullable: true,
  })
  phone: string

  @Column({
    type: 'enum',
    enum: ['male', 'female', 'unknown'],
    default: 'unknown',
    comment: '用户性别',
  })
  gender: 'male' | 'female' | 'unknown'

  @Column({
    length: 100,
    default: '',
    comment: '头像地址',
  })
  avatar: string

  @Column({
    length: 100,
    default: '',
    comment: '密码',
  })
  password: string

  @Column({
    type: 'smallint',
    default: 1,
    comment: '帐号状态（0停用 1正常）',
  })
  userStatus: number

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
    nullable: true,
    comment: '备注',
  })
  remark: string

  @Column({
    type: 'smallint',
    default: 0,
    comment: '删除标志（0未删除 1已删除）',
  })
  delFlag: number

  // 多个用户属于一个部门
  @ManyToOne(() => Dept, dept => dept.users)
  @JoinColumn()
  dept: Dept

  @ManyToMany(() => Role, role => role.users)
  @JoinTable({
    name: 'sys_user_role',
  })
  roles: Role[]

  @BeforeInsert()
  beforeSave() {
    this.password = encryptData(this.password)
  }
}
