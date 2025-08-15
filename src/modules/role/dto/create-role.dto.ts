import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsIn,
} from 'class-validator'

export class CreateRoleDto {
  @IsNotEmpty({ message: '角色名称不可为空' })
  @IsString()
  name: string

  @IsNotEmpty({ message: '角色权限字符串不可为空' })
  @IsString()
  roleKey: string

  @IsNumber()
  sort: number

  @IsNumber()
  @IsIn([0, 1], { message: '角色状态只能是 0、1' })
  @IsOptional()
  roleStatus?: number = 1

  @IsString()
  @IsOptional()
  remark?: string
}
