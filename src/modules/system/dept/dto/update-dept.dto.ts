import { PartialType } from '@nestjs/swagger'
import { CreateDeptDto } from './create-dept.dto'
import { IsNotEmpty, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateDeptDto extends PartialType(CreateDeptDto) {
  @ApiProperty({
    description: '部门ID',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty({ message: '部门ID不能为空' })
  deptId: number
}
