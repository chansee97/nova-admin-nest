import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsIn,
  Length,
  Matches,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateDictTypeDto {
  @ApiProperty({
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

  @ApiPropertyOptional({
    description: '状态',
    enum: [0, 1],
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @IsIn([0, 1], { message: '状态只能是 0、1' })
  status?: number = 1

  @ApiPropertyOptional({
    description: '备注信息',
    example: '用户性别字典',
  })
  @IsOptional()
  @IsString()
  remark?: string
}
