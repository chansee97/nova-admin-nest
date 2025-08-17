import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import type { LoginAuthDto } from './dto/login-auth.dto'
import { UserService } from '@/modules/system/user/user.service'
import type { User } from '@/modules/system/user/entities/user.entity'
import { encryptData } from '@/utils/crypto'
import { ApiErrorCode } from '@/common/enums'
import { ApiException } from '@/common/filters'
import { CaptchaService } from './captcha.service'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private captchaService: CaptchaService,
  ) {}

  async login(loginAuthDto: LoginAuthDto) {
    const { username, password, captchaId, captcha } = loginAuthDto

    // 1. 验证验证码（如果启用）
    if (captchaId && captcha) {
      this.captchaService.verifyCaptcha(captchaId, captcha)
    } else {
      // 如果验证码启用但未提供，则验证会在 verifyCaptcha 中处理
      this.captchaService.verifyCaptcha(captchaId || '', captcha || '')
    }

    // 2. 验证用户名密码
    const user = await this.validateUser(username, password)
    if (!user) {
      throw new ApiException('密码错误', ApiErrorCode.USER_PASSWORD_INVALID)
    }

    // 3. 生成 Token
    const token = this.generateToken(user)
    return { ...user, ...token }
  }

  generateToken(user: User) {
    return {
      accessToken: this.jwtService.sign(user),
      refreshToken: this.jwtService.sign(user, { expiresIn: '8d' }),
    }
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userService.findOneByUserName(username)
    if (user && user.password === encryptData(password)) {
      delete user.password
      return user
    }
    return null
  }

  verifyToken(token: string): User {
    const info = this.jwtService.verify<User>(token, {
      secret: this.configService.get('JWT_SECRET'),
    })
    return info
  }

  async refreshToken(refreshToken: string) {
    const res = this.jwtService.verify<User>(refreshToken)

    if (res && res.username) {
      const user = await this.userService.findOneByUserName(res.username)
      return this.generateToken(user)
    }
    return null
  }
}
