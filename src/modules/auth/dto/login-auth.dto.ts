import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginAuthDto {
  @ApiProperty({
    description: '用户名',
    example: 'admin',
    required: true,
  })
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  username: string

  @ApiProperty({
    description: '密码',
    example: '123456',
    required: true,
  })
  @IsNotEmpty({
    message: '密码不能为空',
  })
  password: string
}
