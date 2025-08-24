import {
  IsString,
  IsOptional,
  IsNumber,
  IsIn,
  IsNotEmpty,
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
  menuName: string

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
    enum: [0, 1],
    example: 0,
  })
  @IsNumber()
  @IsIn([0, 1], { message: '是否为外链只能是 0、1' })
  @IsOptional()
  isFrame?: number = 0

  @ApiProperty({
    required: false,
    description: '是否缓存',
    enum: [0, 1],
    example: 1,
  })
  @IsNumber()
  @IsIn([0, 1], { message: '是否缓存只能是 0、1' })
  @IsOptional()
  isCache?: number = 1

  @ApiProperty({
    required: true,
    description: '菜单类型',
    enum: ['M', 'C', 'F'],
    example: 'M',
  })
  @IsString()
  @IsIn(['M', 'C', 'F'], { message: '菜单类型只能是 M、C、F' })
  menuType: 'M' | 'C' | 'F'

  @ApiProperty({
    required: false,
    description: '显示状态',
    enum: [0, 1],
    example: 1,
  })
  @IsNumber()
  @IsIn([0, 1], { message: '显示状态只能是 0、1' })
  @IsOptional()
  visible?: number = 1

  @ApiProperty({
    required: false,
    description: '菜单状态',
    enum: [0, 1],
    example: 1,
  })
  @IsNumber()
  @IsIn([0, 1], { message: '菜单状态只能是 0、1' })
  @IsOptional()
  status?: number = 1

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
    description: '备注信息',
    example: '系统管理菜单',
  })
  @IsString()
  @IsOptional()
  remark?: string = ''
}
