import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { SearchQuery } from '@/common/dto/page.dto'

class DateRangeDto {
  @ApiProperty({ description: '开始时间', required: false })
  @IsOptional()
  @IsString()
  beginTime?: string

  @ApiProperty({ description: '结束时间', required: false })
  @IsOptional()
  @IsString()
  endTime?: string
}

export class ReqOperLogDto extends SearchQuery {
  @ApiProperty({ description: '模块标题', required: false })
  @IsOptional()
  @IsString()
  title?: string

  @ApiProperty({ description: '操作人员', required: false })
  @IsOptional()
  @IsString()
  operName?: string

  @ApiProperty({
    description: '业务类型（0其它 1新增 2修改 3删除）',
    required: false,
  })
  @IsOptional()
  @IsString()
  businessType?: string

  @ApiProperty({ description: '操作状态（0正常 1异常）', required: false })
  @IsOptional()
  @IsString()
  status?: string

  @ApiProperty({ description: '日期范围', required: false, type: DateRangeDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDto)
  params?: DateRangeDto
}
