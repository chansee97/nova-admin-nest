import { IsNotEmpty } from 'class-validator'

export class SetRoleDto {
  @IsNotEmpty()
  userId: number

  @IsNotEmpty()
  roleIds: number[]
}
