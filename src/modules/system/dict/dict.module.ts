import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DictTypeService } from './dict-type.service'
import { DictDataService } from './dict-data.service'
import { DictController } from './dict.controller'
import { DictType } from './entities/dict-type.entity'
import { DictData } from './entities/dict-data.entity'

@Module({
  imports: [TypeOrmModule.forFeature([DictType, DictData])],
  controllers: [DictController],
  providers: [DictTypeService, DictDataService],
  exports: [DictTypeService, DictDataService],
})
export class DictModule {}
