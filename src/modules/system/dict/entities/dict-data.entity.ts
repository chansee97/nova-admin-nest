import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { DateFormat } from '@/common/decorators'

@Entity('sys_dict_data')
@Index(['dictType'])
@Index(['sort'])
@Index(['status'])
export class DictData {
  @PrimaryGeneratedColumn({
    comment: '字典数据id',
  })
  id: number

  @Column({
    type: 'integer',
    default: 0,
    comment: '字典排序',
  })
  sort: number

  @Column({
    length: 100,
    default: '',
    comment: '字典标签',
  })
  name: string

  @Column({
    length: 100,
    default: '',
    comment: '字典键值',
  })
  value: string

  @Column({
    length: 100,
    default: '',
    comment: '字典类型',
  })
  dictType: string

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

  // 关联的字典类型实体
  @ManyToOne('DictType', 'dictDataList')
  @JoinColumn({ referencedColumnName: 'type' })
  dictTypeEntity: any
}
