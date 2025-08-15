import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DictTypeService } from './dict-type.service'
import { DictDataService } from './dict-data.service'
import { DictTypeController } from './dict-type.controller'
import { DictDataController } from './dict-data.controller'
import { DictType } from './entities/dict-type.entity'
import { DictData } from './entities/dict-data.entity'

@Module({
  imports: [TypeOrmModule.forFeature([DictType, DictData])],
  controllers: [DictTypeController, DictDataController],
  providers: [DictTypeService, DictDataService],
  exports: [DictTypeService, DictDataService],
})
export class DictModule {}
