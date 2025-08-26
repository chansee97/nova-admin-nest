import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsIn,
  Length,
  IsBoolean,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateDictDataDto {
  @ApiProperty({ required: false, description: '字典排序', example: 1 })
  @IsOptional()
  @IsNumber()
  dictSort?: number = 0

  @ApiProperty({
    required: true,
    description: '字典标签',
    example: '男',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: '字典标签不能为空' })
  @Length(1, 100, {
    message: '字典标签长度1-100',
  })
  dictLabel: string

  @ApiProperty({
    required: true,
    description: '字典键值',
    example: '1',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: '字典键值不能为空' })
  @Length(1, 100, {
    message: '字典键值长度1-100',
  })
  dictValue: string

  @ApiProperty({
    required: true,
    description: '字典类型',
    example: 'sys_user_sex',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: '字典类型不能为空' })
  @Length(1, 100, {
    message: '字典类型长度1-100',
  })
  dictType: string

  @ApiProperty({ required: false, description: '样式属性', example: 'primary' })
  @IsOptional()
  @IsString()
  cssClass?: string

  @ApiProperty({
    required: false,
    description: '表格回显样式',
    example: 'default',
  })
  @IsOptional()
  @IsString()
  listClass?: string

  @ApiProperty({
    required: false,
    description: '是否默认',
    type: Boolean,
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean = false

  @ApiProperty({
    required: false,
    description: '状态',
    enum: [0, 1],
    example: 0,
  })
  @IsOptional()
  @IsNumber()
  @IsIn([0, 1], { message: '状态：0=正常，1=停用' })
  status?: number = 0

  @ApiProperty({ required: false, description: '备注信息', example: '男性' })
  @IsOptional()
  @IsString()
  remark?: string
}
