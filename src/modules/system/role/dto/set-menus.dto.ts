import { IsNotEmpty } from 'class-validator'

export class SetMenusDto {
  @IsNotEmpty()
  roleId: number

  @IsNotEmpty()
  menuIds: number[]
}
