import { PartialType } from '@nestjs/swagger'
import { CreateDictTypeDto } from './create-dict-type.dto'

export class UpdateDictTypeDto extends PartialType(CreateDictTypeDto) {}
