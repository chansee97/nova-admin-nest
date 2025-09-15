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

export class ReqLoginLogDto extends SearchQuery {
  @ApiProperty({ description: '用户账号', required: false })
  @IsOptional()
  @IsString()
  userName?: string

  @ApiProperty({ description: '登录IP地址', required: false })
  @IsOptional()
  @IsString()
  ipaddr?: string

  @ApiProperty({ description: '登录状态（0成功 1失败）', required: false })
  @IsOptional()
  @IsString()
  status?: string

  @ApiProperty({ description: '日期范围', required: false, type: DateRangeDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDto)
  params?: DateRangeDto
}
