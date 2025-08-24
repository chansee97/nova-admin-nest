import { PartialType } from '@nestjs/swagger'
import { CreateDeptDto } from './create-dept.dto'

export class UpdateDeptDto extends PartialType(CreateDeptDto) {}
