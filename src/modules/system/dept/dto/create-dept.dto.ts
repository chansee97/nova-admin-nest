import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsIn,
  Length,
  IsEmail,
  ValidateIf,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateDeptDto {
  @ApiProperty({ required: false, description: '父部门ID', example: 0 })
  @IsOptional()
  @IsNumber()
  parentId?: number = 0

  @ApiProperty({ required: false, description: '祖级列表', example: '0,1,2' })
  @IsOptional()
  @IsString()
  ancestors?: string = ''

  @ApiProperty({
    required: true,
    description: '部门名称',
    example: '技术部',
    minLength: 1,
    maxLength: 30,
  })
  @IsString()
  @IsNotEmpty({ message: '部门名称不能为空' })
  @Length(1, 30, {
    message: '部门名称长度1-30',
  })
  deptName: string

  @ApiProperty({ required: false, description: '显示顺序', example: 1 })
  @IsOptional()
  @IsNumber()
  sort?: number = 0

  @ApiProperty({ required: false, description: '负责人', example: '张三' })
  @IsOptional()
  @IsString()
  @Length(0, 11, {
    message: '负责人名称长度不能超过11',
  })
  leader?: string = ''

  @ApiProperty({
    required: false,
    description: '联系电话',
    example: '13800138000',
  })
  @IsOptional()
  @IsString()
  @Length(0, 11, {
    message: '联系电话长度不能超过11',
  })
  phone?: string = ''

  @ApiProperty({
    required: false,
    description: '邮箱',
    example: 'tech@company.com',
  })
  @IsOptional()
  @IsString()
  @ValidateIf(object => object.email !== '')
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string = ''

  @ApiProperty({
    required: false,
    description: '部门状态',
    enum: [0, 1],
    example: 0,
  })
  @IsOptional()
  @IsNumber()
  @IsIn([0, 1], { message: '状态：0=正常，1=停用' })
  status?: number = 0

  @ApiProperty({
    required: false,
    description: '备注信息',
    example: '技术研发部门',
  })
  @IsOptional()
  @IsString()
  remark?: string
}
