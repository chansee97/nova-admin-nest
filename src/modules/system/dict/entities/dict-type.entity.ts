import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { DateFormat } from '@/common/decorators'

@Entity('sys_dict_type')
@Index(['type'])
@Index(['status'])
export class DictType {
  @PrimaryGeneratedColumn({
    comment: '字典主键',
  })
  id: number

  @Column({
    length: 100,
    default: '',
    comment: '字典名称',
  })
  name: string

  @Column({
    length: 100,
    default: '',
    unique: true,
    comment: '字典类型',
  })
  type: string

  @Column({
    type: 'smallint',
    default: 0,
    comment: '状态（0正常 1停用）',
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

  // 一个字典类型可以有多个字典数据
  @OneToMany('DictData', 'dictTypeEntity')
  dictDataList: any[]
}
