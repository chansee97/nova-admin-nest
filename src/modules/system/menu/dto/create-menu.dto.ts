import {
  IsString,
  IsOptional,
  IsNumber,
  IsIn,
  IsNotEmpty,
} from 'class-validator'

export class CreateMenuDto {
  /**
   * 菜单名称
   */
  @IsNotEmpty({ message: '菜单名不可为空' })
  @IsString()
  menuName: string

  /**
   * 父菜单ID
   */
  @IsNumber({}, { message: '父菜单ID必须是数字' })
  @IsOptional()
  parentId?: number = 0

  /**
   * 显示顺序
   */
  @IsNumber({}, { message: '显示顺序必须是数字' })
  @IsOptional()
  sort?: number = 0

  /**
   * 路由地址
   */
  @IsString()
  @IsOptional()
  path?: string = ''

  /**
   * 组件路径
   */
  @IsString()
  @IsOptional()
  component?: string

  /**
   * 是否为外链
   */
  @IsNumber()
  @IsIn([0, 1], { message: '是否为外链只能是 0、1' })
  @IsOptional()
  isFrame?: number = 0

  /**
   * 是否缓存
   */
  @IsNumber()
  @IsIn([0, 1], { message: '是否缓存只能是 0、1' })
  @IsOptional()
  isCache?: number = 1

  /**
   * 菜单类型
   */
  @IsString()
  @IsIn(['M', 'C', 'F'], { message: '菜单类型只能是 M、C、F' })
  menuType: 'M' | 'C' | 'F'

  /**
   * 显示状态
   */
  @IsNumber()
  @IsIn([0, 1], { message: '显示状态只能是 0、1' })
  @IsOptional()
  visible?: number = 1

  /**
   * 菜单状态
   */
  @IsNumber()
  @IsIn([0, 1], { message: '菜单状态只能是 0、1' })
  @IsOptional()
  status?: number = 1

  /**
   * 权限标识
   */
  @IsString()
  @IsOptional()
  perms?: string = ''

  /**
   * 菜单图标
   */
  @IsString()
  @IsOptional()
  icon?: string = '#'

  /**
   * 备注
   */
  @IsString()
  @IsOptional()
  remark?: string = ''
}
