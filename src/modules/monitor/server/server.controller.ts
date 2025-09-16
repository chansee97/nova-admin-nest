import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ServerService } from './server.service'

@ApiTags('服务状态')
@Controller('server-status')
export class ServerController {
  constructor(private readonly serverService: ServerService) {}

  @ApiOperation({ summary: '获取本机服务运行与硬件状态' })
  @Get()
  getStatus() {
    return this.serverService.getSnapshot()
  }
}
