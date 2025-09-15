import { Controller, Get, Query, Delete, Param } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger'
import { LoginLogService } from './login-log.service'
import { ReqLoginLogDto } from './dto/req-login-log.dto'
import { Log, BusinessType } from '@/common/decorators/log.decorator'

@ApiTags('Monitor - Login Log')
@Controller('monitor/login-log')
export class LoginLogController {
  constructor(private readonly loginLogService: LoginLogService) {}

  @ApiOperation({ summary: '分页查询登录日志' })
  @Get()
  async list(@Query() reqLoginLogDto: ReqLoginLogDto) {
    return await this.loginLogService.list(reqLoginLogDto)
  }

  @ApiOperation({ summary: '删除登录日志' })
  @ApiParam({ name: 'ids', description: '日志id' })
  @Log(BusinessType.DELETE)
  @Delete(':ids')
  async remove(@Param('ids') ids: string) {
    const idArr = ids.split(',').map(Number)
    return await this.loginLogService.remove(idArr)
  }

  @ApiOperation({ summary: '清空登录日志' })
  @Log(BusinessType.OTHER)
  @Delete('clean')
  async clean() {
    return await this.loginLogService.clean()
  }

  @ApiOperation({ summary: '查询登录日志详细' })
  @ApiParam({ name: 'id', description: '日志id' })
  @Get(':id')
  async detail(@Param('id') id: number) {
    return await this.loginLogService.detail(id)
  }
}
