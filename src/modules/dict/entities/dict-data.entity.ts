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
@Index('idx_dict_data_type', ['dictType'])
@Index('idx_dict_data_sort', ['dictSort'])
@Index('idx_dict_data_status', ['status'])
export class DictData {
  @PrimaryGeneratedColumn({
    name: 'dict_code',
    comment: '字典编码',
  })
  dictCode: number

  @Column({
    name: 'dict_sort',
    type: 'integer',
    default: 0,
    comment: '字典排序',
  })
  dictSort: number

  @Column({
    name: 'dict_label',
    length: 100,
    default: '',
    comment: '字典标签',
  })
  dictLabel: string

  @Column({
    name: 'dict_value',
    length: 100,
    default: '',
    comment: '字典键值',
  })
  dictValue: string

  @Column({
    name: 'dict_type',
    length: 100,
    default: '',
    comment: '字典类型',
  })
  dictType: string

  @Column({
    name: 'css_class',
    length: 100,
    nullable: true,
    comment: '样式属性（其他样式扩展）',
  })
  cssClass: string

  @Column({
    name: 'list_class',
    length: 100,
    nullable: true,
    comment: '表格回显样式',
  })
  listClass: string

  @Column({
    name: 'is_default',
    type: 'smallint',
    default: 0,
    comment: '是否默认（0否 1是）',
  })
  isDefault: number

  @Column({
    type: 'smallint',
    default: 1,
    comment: '状态（0停用 1正常）',
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

  // 多个字典数据属于一个字典类型
  @ManyToOne('DictType', 'dictDataList')
  @JoinColumn({ name: 'dict_type', referencedColumnName: 'dictType' })
  dictTypeEntity: any
}
