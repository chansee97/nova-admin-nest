import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsIn,
  Length,
  Matches,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiPropertyOptional({
    description: '部门ID',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  deptId?: number

  @ApiProperty({
    description: '用户账号',
    example: 'admin',
    minLength: 5,
    maxLength: 30,
  })
  @IsString()
  @IsNotEmpty({ message: '用户账号不能为空' })
  @Length(5, 30, {
    message: '用户名长度5-30',
  })
  @Matches(/^[\w#$%-]+$/, {
    message: '用户名只能是字母、数字或者 #、$、%、_、- 这些字符',
  })
  username: string

  @ApiProperty({
    description: '用户昵称',
    example: '管理员',
    minLength: 1,
    maxLength: 30,
  })
  @IsString()
  @IsNotEmpty({ message: '用户昵称不能为空' })
  @Length(1, 30, {
    message: '用户昵称长度1-30',
  })
  nickName: string

  @ApiPropertyOptional({
    description: '用户邮箱',
    example: 'admin@example.com',
  })
  @IsOptional()
  @IsString()
  email?: string

  @ApiPropertyOptional({
    description: '手机号码',
    example: '13800138000',
  })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiPropertyOptional({
    description: '用户性别',
    enum: ['male', 'female', 'unknown'],
    example: 'male',
  })
  @IsOptional()
  @IsString()
  @IsIn(['male', 'female', 'unknown'], {
    message: '性别只能是 male、female、unknown',
  })
  gender?: 'male' | 'female' | 'unknown' = 'unknown'

  @ApiPropertyOptional({
    description: '头像地址',
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsString()
  avatar?: string

  @ApiProperty({
    description: '用户密码',
    example: '123456',
    minLength: 6,
    maxLength: 30,
  })
  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  @Length(6, 30, {
    message: '密码长度6-30',
  })
  password: string

  @ApiPropertyOptional({
    description: '用户状态',
    enum: [0, 1],
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @IsIn([0, 1], { message: '状态只能是 0、1' })
  userStatus?: number = 1

  @ApiPropertyOptional({
    description: '备注信息',
    example: '系统管理员',
  })
  @IsOptional()
  @IsString()
  remark?: string
}
