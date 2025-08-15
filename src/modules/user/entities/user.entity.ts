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
import { Role } from '@/modules/role/entities/role.entity'
import { Dept } from '@/modules/dept/entities/dept.entity'
import { encryptData } from '@/utils/crypto'

@Entity('sys_user')
@Index('idx_username', ['username'])
@Index('idx_phone', ['phone'])
@Index('idx_email', ['email'])
@Index('idx_status_delflag', ['userStatus', 'delFlag'])
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id', comment: '用户ID' })
  id: number

  @Column({
    name: 'dept_id',
    type: 'integer',
    nullable: true,
    comment: '部门ID',
  })
  deptId: number

  @Column({
    name: 'user_name',
    length: 30,
    unique: true,
    comment: '用户账号',
  })
  username: string

  @Column({
    name: 'nick_name',
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
    name: 'user_status',
    type: 'smallint',
    default: 1,
    comment: '帐号状态（0停用 1正常）',
  })
  userStatus: number

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

  // 多个用户属于一个部门
  @ManyToOne(() => Dept, dept => dept.users)
  @JoinColumn({ name: 'dept_id' })
  dept: Dept

  @ManyToMany(() => Role, role => role.users)
  @JoinTable({
    name: 'sys_user_role',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles: Role[]

  @BeforeInsert()
  beforeSave() {
    this.password = encryptData(this.password)
  }
}
