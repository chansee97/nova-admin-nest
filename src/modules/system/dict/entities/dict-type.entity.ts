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
@Index(['dictType'])
@Index(['status'])
export class DictType {
  @PrimaryGeneratedColumn({
    comment: '字典主键',
  })
  dictId: number

  @Column({
    length: 100,
    default: '',
    comment: '字典名称',
  })
  dictName: string

  @Column({
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

  // 一个字典类型可以有多个字典数据
  @OneToMany('DictData', 'dictTypeEntity')
  dictDataList: any[]
}
