import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, IsInt } from 'class-validator'
import { Type } from 'class-transformer'
import { SearchQuery } from '@/common/dto/page.dto'

export class ReqOperLogDto extends SearchQuery {
  @ApiProperty({ description: '模块标题', required: false })
  @IsOptional()
  @IsString()
  title?: string

  @ApiProperty({ description: '操作人员', required: false })
  @IsOptional()
  @IsString()
  operName?: string

  @ApiProperty({ description: '操作状态（0正常 1异常）', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  status?: number

  @ApiProperty({ description: '操作时间', required: false })
  @IsOptional()
  @IsString()
  operTime?: string
}
