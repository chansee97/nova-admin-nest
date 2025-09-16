import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, IsInt } from 'class-validator'
import { Type } from 'class-transformer'
import { SearchQuery } from '@/common/dto/page.dto'

export class ReqLoginLogDto extends SearchQuery {
  @ApiProperty({ description: '用户账号', required: false })
  @IsOptional()
  @IsString()
  username?: string

  @ApiProperty({ description: '登录IP地址', required: false })
  @IsOptional()
  @IsString()
  ipaddr?: string

  @ApiProperty({ description: '登录状态（0成功 1失败）', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  status?: number

  @ApiProperty({ description: '日期范围', required: false })
  @IsOptional()
  @IsString()
  loginTime?: string
}
