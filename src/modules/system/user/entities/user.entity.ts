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
import { Exclude } from 'class-transformer'
import { DateFormat } from '@/common/decorators'
import { Role } from '@/modules/system/role/entities/role.entity'
import { Dept } from '@/modules/system/dept/entities/dept.entity'
import { encryptData } from '@/utils/crypto'

@Entity('sys_user')
@Index(['username'])
@Index(['phone'])
@Index(['email'])
@Index(['status'])
export class User {
  @PrimaryGeneratedColumn({ comment: '用户ID' })
  id: number

  @Column({
    type: 'integer',
    nullable: true,
    comment: '部门ID',
  })
  deptId: number | null

  @Column({
    length: 30,
    unique: true,
    comment: '用户账号',
  })
  username: string

  @Column({
    length: 30,
    default: '',
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
  @Exclude()
  password: string

  @Column({
    type: 'smallint',
    default: 0,
    comment: '帐号状态（0正常 1停用）',
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

  // 多个用户属于一个部门
  @ManyToOne(() => Dept, dept => dept.users, { nullable: true })
  @JoinColumn({ name: 'dept_id' })
  dept: Dept | null

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
