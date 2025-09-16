import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { DateFormat } from '@/common/decorators'

@Entity({ name: 'sys_oper_log' })
export class OperLog {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column({ comment: '模块标题' })
  title: string

  @Column({ comment: '方法名称', default: '' })
  method: string

  @Column({ comment: '请求方式', default: '' })
  requestMethod: string

  @Column({ comment: '操作人员', default: '' })
  operName: string

  @Column({ comment: '部门名称', default: '' })
  deptName: string

  @Column({ comment: '请求URL', default: '' })
  operUrl: string

  @Column({ comment: '主机地址', default: '' })
  operIp: string

  @Column({ comment: '操作地点', default: '' })
  operLocation: string

  @Column({ comment: '浏览器类型', default: '' })
  browser: string

  @Column({ comment: '操作系统', default: '' })
  os: string

  @Column({ comment: '请求参数', type: 'text', default: null })
  operParam: string

  @Column({ comment: '返回参数', type: 'text', default: null })
  jsonResult: string

  @Column({
    comment: '操作状态（0正常 1异常）',
    type: 'int',
    default: 0,
  })
  status: number

  @Column({ comment: '错误消息', default: '' })
  errorMsg: string

  @Column({ comment: '消耗时间', default: '' })
  costTime: string

  @DateFormat()
  @CreateDateColumn({ comment: '操作时间' })
  operTime: Date
}
