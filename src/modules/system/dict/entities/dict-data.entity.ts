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

@Entity('sys_dict_data')
@Index(['dictType'])
@Index(['dictSort'])
@Index(['status'])
export class DictData {
  @PrimaryGeneratedColumn({
    comment: '字典编码',
  })
  dictCode: number

  @Column({
    type: 'integer',
    default: 0,
    comment: '字典排序',
  })
  dictSort: number

  @Column({
    length: 100,
    default: '',
    comment: '字典标签',
  })
  dictLabel: string

  @Column({
    length: 100,
    default: '',
    comment: '字典键值',
  })
  dictValue: string

  @Column({
    length: 100,
    default: '',
    comment: '字典类型',
  })
  dictType: string

  @Column({
    length: 100,
    default: '',
    comment: '样式属性（其他样式扩展）',
  })
  cssClass: string

  @Column({
    length: 100,
    default: '',
    comment: '表格回显样式',
  })
  listClass: string

  @Column({
    type: 'boolean',
    default: false,
    comment: '是否默认',
  })
  isDefault: boolean

  @Column({
    type: 'smallint',
    default: 0,
    comment: '状态（0正常 1停用）',
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
    default: '',
    comment: '备注',
  })
  remark: string

  // 关联的字典类型实体
  @ManyToOne('DictType', 'dictDataList')
  @JoinColumn({ referencedColumnName: 'dictType' })
  dictTypeEntity: any
}
