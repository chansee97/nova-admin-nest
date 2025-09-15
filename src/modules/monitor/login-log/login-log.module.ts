import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LoginLog } from './entities/login-log.entity'
import { LoginLogService } from './login-log.service'
import { LoginLogController } from './login-log.controller'

@Module({
  imports: [TypeOrmModule.forFeature([LoginLog])],
  controllers: [LoginLogController],
  providers: [LoginLogService],
  exports: [LoginLogService],
})
export class LoginLogModule {}
