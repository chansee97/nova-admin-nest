import { Module } from '@nestjs/common'
import { LoginLogModule } from './login-log/login-log.module'
import { ServerModule } from './server/server.module'

@Module({
  imports: [LoginLogModule, ServerModule],
  exports: [LoginLogModule, ServerModule],
})
export class MonitorModule {}
