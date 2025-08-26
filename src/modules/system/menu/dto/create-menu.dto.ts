import {
  IsString,
  IsOptional,
  IsNumber,
  IsIn,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateMenuDto {
  @ApiProperty({
    required: true,
    description: '菜单名称',
    example: '系统管理',
    minLength: 1,
    maxLength: 50,
  })
  @IsNotEmpty({ message: '菜单名不可为空' })
  @IsString()
  title: string

  @ApiProperty({
    required: false,
    description: '父菜单ID',
    example: 0,
  })
  @IsNumber({}, { message: '父菜单ID必须是数字' })
  @IsOptional()
  parentId?: number = 0

  @ApiProperty({
    required: false,
    description: '显示顺序',
    example: 1,
  })
  @IsNumber({}, { message: '显示顺序必须是数字' })
  @IsOptional()
  sort?: number = 0

  @ApiProperty({
    required: false,
    description: '路由地址',
    example: '/system',
  })
  @IsString()
  @IsOptional()
  path?: string = ''

  @ApiProperty({
    required: false,
    description: '组件路径',
    example: 'system/index',
  })
  @IsString()
  @IsOptional()
  component?: string

  @ApiProperty({
    required: false,
    description: '是否为外链',
    type: Boolean,
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isLink?: boolean = false

  @ApiProperty({
    required: false,
    description: '是否缓存',
    type: Boolean,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  keepAlive?: boolean = true

  @ApiProperty({
    required: true,
    description: '菜单类型',
    enum: ['directory', 'page', 'permission'],
    example: 'directory',
  })
  @IsString()
  @IsIn(['directory', 'page', 'permission'], {
    message: '菜单类型只能是 directory、page、permission',
  })
  menuType: 'directory' | 'page' | 'permission'

  @ApiProperty({
    required: false,
    description: '菜单显示状态',
    type: Boolean,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  menuVisible?: boolean = true

  @ApiProperty({
    required: false,
    description: '菜单状态',
    enum: [0, 1],
    example: 0,
  })
  @IsNumber()
  @IsIn([0, 1], { message: '菜单状态：0=正常，1=停用' })
  @IsOptional()
  status?: number = 0

  @ApiProperty({
    required: false,
    description: '权限标识',
    example: 'system:user:list',
  })
  @IsString()
  @IsOptional()
  perms?: string = ''

  @ApiProperty({
    required: false,
    description: '菜单图标',
    example: 'system',
  })
  @IsString()
  @IsOptional()
  icon?: string = '#'

  @ApiProperty({
    required: false,
    description: '国际化标识Key',
    example: 'route.system',
  })
  @IsString()
  @IsOptional()
  i18nKey?: string = ''

  @ApiProperty({
    required: false,
    description: '高亮菜单路径',
    example: '/system/user',
  })
  @IsString()
  @IsOptional()
  activePath?: string = ''

  @ApiProperty({
    required: false,
    description: '标签栏显示状态',
    type: Boolean,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  tabVisible?: boolean = true

  @ApiProperty({
    required: false,
    description: '备注信息',
    example: '系统管理菜单',
  })
  @IsString()
  @IsOptional()
  remark?: string = ''
}
