import { IsNotEmpty, IsString, Length, Matches } from 'class-validator'

/**
 * 注册的时候，用户名密码不能为空，长度为 6-30，并且限定了不能是特殊字符。
 */
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 30, {
    message: '用户名长度5-30',
  })
  @Matches(/^[\w#$%-]+$/, {
    message: '用户名只能是字母、数字或者 #、$、%、_、- 这些字符',
  })
  username: string

  @IsString()
  @IsNotEmpty()
  @Length(6, 30)
  password: string

  nickname: string

  avatar: string

  email: string

  tel: string
}
