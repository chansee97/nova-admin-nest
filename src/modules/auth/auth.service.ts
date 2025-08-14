import type { ConfigService } from '@nestjs/config'
import type { JwtService } from '@nestjs/jwt'
import type { LoginAuthDto } from './dto/login-auth.dto'
import type { UserService } from '@/modules/user/user.service'
import { Injectable } from '@nestjs/common'
import { ApiErrorCode } from '@/common/enum'
import { ApiException } from '@/common/filters'
import { encryptData } from '@/utils/crypto'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginAuthDto: LoginAuthDto) {
    const { username, password } = loginAuthDto

    const user = await this.validateUser(username, password)
    if (!user)
      throw new ApiException('密码错误', ApiErrorCode.USER_PASSWORD_INVALID)

    const token = this.generateToken(user)
    return { ...user, ...token }
  }

  generateToken(user: any) {
    const payload = { username: user.username, userId: user.id }
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '8d' }),
    }
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOneByUserName(username)
    if (user.password === encryptData(password)) {
      delete user.password
      return user
    }
    return null
  }

  verifyToken(token: string) {
    const info = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_SECRET'),
    })
    return info
  }

  async refreshToken(refreshToken: string) {
    const res: any = await this.jwtService.verify(refreshToken)

    if (res) {
      const user = await this.userService.findOneByUserName(res.username)
      return this.generateToken(user)
    }
    return null
  }
}
