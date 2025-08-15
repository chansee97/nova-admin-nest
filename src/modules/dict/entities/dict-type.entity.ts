import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('sys_dict_type')
@Index('idx_dict_type_type', ['dictType'])
@Index('idx_dict_type_status', ['status'])
export class DictType {
  @PrimaryGeneratedColumn({
    name: 'dict_id',
    comment: '字典主键',
  })
  dictId: number

  @Column({
    name: 'dict_name',
    length: 100,
    default: '',
    comment: '字典名称',
  })
  dictName: string

  @Column({
    name: 'dict_type',
    length: 100,
    default: '',
    unique: true,
    comment: '字典类型',
  })
  dictType: string

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

  // 一个字典类型可以有多个字典数据
  @OneToMany('DictData', 'dictTypeEntity')
  dictDataList: any[]
}
