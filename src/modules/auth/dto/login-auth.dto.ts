import { IsNotEmpty, IsOptional } from 'class-validator'
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

  @ApiProperty({
    description: '验证码ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsOptional()
  captchaId?: string

  @ApiProperty({
    description: '验证码',
    example: 'A3B7',
    required: false,
  })
  @IsOptional()
  captcha?: string
}
