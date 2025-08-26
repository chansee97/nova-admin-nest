import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsIn,
  Length,
  Matches,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateDictTypeDto {
  @ApiProperty({
    required: true,
    description: '字典名称',
    example: '用户性别',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: '字典名称不能为空' })
  @Length(1, 100, {
    message: '字典名称长度1-100',
  })
  dictName: string

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
  @Matches(/^[a-z0-9_]+$/, {
    message: '字典类型只能包含小写字母、数字和下划线',
  })
  dictType: string

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

  @ApiProperty({
    required: false,
    description: '备注信息',
    example: '用户性别字典',
  })
  @IsOptional()
  @IsString()
  remark?: string
}
