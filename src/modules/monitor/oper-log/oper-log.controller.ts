import { Controller, Get, Query, Delete, Param } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger'
import { OperLogService } from './oper-log.service'
import { ReqOperLogDto } from './dto/req-oper-log.dto'

@ApiTags('操作日志')
@Controller('oper-log')
export class OperLogController {
  constructor(private readonly operLogService: OperLogService) {}

  @ApiOperation({ summary: '分页查询操作日志' })
  @Get()
  async list(@Query() reqOperLogDto: ReqOperLogDto) {
    return await this.operLogService.list(reqOperLogDto)
  }

  @ApiOperation({ summary: '清空操作日志' })
  @Delete('clean')
  async clean() {
    return await this.operLogService.clean()
  }

  @ApiOperation({ summary: '删除操作日志' })
  @ApiParam({ name: 'ids', description: '日志id' })
  @Delete(':ids')
  async remove(@Param('ids') ids: string) {
    const idArr = ids.split(',').map(Number)
    return await this.operLogService.remove(idArr)
  }

  @ApiOperation({ summary: '查询操作日志详细' })
  @ApiParam({ name: 'id', description: '日志id' })
  @Get(':id')
  async detail(@Param('id') id: number) {
    return await this.operLogService.detail(id)
  }
}
