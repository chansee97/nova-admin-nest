import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsIn,
  IsArray,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateRoleDto {
  @ApiProperty({
    required: true,
    description: '角色名称',
    example: '管理员',
    minLength: 1,
    maxLength: 30,
  })
  @IsNotEmpty({ message: '角色名称不可为空' })
  @IsString()
  roleName: string

  @ApiProperty({
    required: true,
    description: '角色权限字符串',
    example: 'admin',
    minLength: 1,
    maxLength: 100,
  })
  @IsNotEmpty({ message: '角色权限字符串不可为空' })
  @IsString()
  roleKey: string

  @ApiProperty({
    required: true,
    description: '显示顺序',
    example: 1,
  })
  @IsNumber()
  sort: number

  @ApiProperty({
    required: false,
    description: '角色状态',
    enum: [0, 1],
    example: 0,
  })
  @IsNumber()
  @IsIn([0, 1], { message: '状态：0=正常，1=停用' })
  @IsOptional()
  roleStatus?: number = 0

  @ApiProperty({
    required: false,
    description: '备注信息',
    example: '系统管理员角色',
  })
  @IsString()
  @IsOptional()
  remark?: string

  @ApiProperty({
    required: false,
    description: '菜单ID数组',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  menuIds?: number[]
}
