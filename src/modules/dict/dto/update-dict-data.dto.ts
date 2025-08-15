import { PartialType } from '@nestjs/swagger'
import { CreateDictDataDto } from './create-dict-data.dto'
import { IsNotEmpty, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateDictDataDto extends PartialType(CreateDictDataDto) {
  @ApiProperty({
    description: '字典编码',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty({ message: '字典编码不能为空' })
  dictCode: number
}
