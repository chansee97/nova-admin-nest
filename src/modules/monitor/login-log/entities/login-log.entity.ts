import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity({ name: 'sys_login_log' })
export class LoginLog {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column({ comment: '用户账号' })
  username: string

  @Column({ length: 50, comment: '登录IP地址' })
  ipaddr: string

  @Column({ length: 255, comment: '登录地点' })
  loginLocation: string

  @Column({ length: 50, comment: '浏览器类型' })
  browser: string

  @Column({ length: 50, comment: '操作系统' })
  os: string

  @Column({ comment: '登录状态（0成功 1失败）', default: '0' })
  status: string

  @Column({ length: 255, comment: '提示消息', default: '' })
  msg: string

  @CreateDateColumn({ comment: '访问时间' })
  loginTime: Date
}
