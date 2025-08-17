import { PartialType } from '@nestjs/mapped-types'
import { IsNotEmpty } from 'class-validator'
import { CreateRoleDto } from './create-role.dto'

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @IsNotEmpty()
  id: number
}
