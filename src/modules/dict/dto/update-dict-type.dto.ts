import { PartialType } from '@nestjs/swagger'
import { CreateDictTypeDto } from './create-dict-type.dto'
import { IsNotEmpty, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateDictTypeDto extends PartialType(CreateDictTypeDto) {
  @ApiProperty({
    description: '字典ID',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty({ message: '字典ID不能为空' })
  dictId: number
}
