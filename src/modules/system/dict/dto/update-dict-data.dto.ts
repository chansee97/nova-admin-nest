import { PartialType } from '@nestjs/swagger'
import { CreateDictDataDto } from './create-dict-data.dto'

export class UpdateDictDataDto extends PartialType(CreateDictDataDto) {}
