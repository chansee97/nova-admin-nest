import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OperLog } from './entities/oper-log.entity'
import { OperLogService } from './oper-log.service'
import { OperLogController } from './oper-log.controller'

@Module({
  imports: [TypeOrmModule.forFeature([OperLog])],
  controllers: [OperLogController],
  providers: [OperLogService],
  exports: [OperLogService],
})
export class OperLogModule {}
