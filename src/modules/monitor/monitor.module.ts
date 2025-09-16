import { Module } from '@nestjs/common'
import { OperLogModule } from './oper-log/oper-log.module'
import { LoginLogModule } from './login-log/login-log.module'
import { ServerModule } from './server/server.module'

@Module({
  imports: [OperLogModule, LoginLogModule, ServerModule],
  exports: [OperLogModule, LoginLogModule, ServerModule],
})
export class MonitorModule {}
