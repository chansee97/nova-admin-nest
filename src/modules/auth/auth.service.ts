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

    // 验证验证码（如果启用）
    if (captchaId && captcha) {
      this.captchaService.verifyCaptcha(captchaId, captcha)
    } else {
      // 如果验证码启用但未提供，则验证会在 verifyCaptcha 中处理
      this.captchaService.verifyCaptcha(captchaId || '', captcha || '')
    }

    // 验证用户名密码
    const user = await this.validateUser(username, password)

    // 生成 Token
    const token = this.generateToken(user)
    return token
  }

  generateToken(user: User) {
    const jwtConfig = this.configService.get('app.jwt')

    // JWT payload 只包含用户ID
    const payload = {
      userId: user.id,
    }

    const result: any = {
      accessToken: this.jwtService.sign(payload),
    }

    // 根据配置决定是否生成刷新token
    if (jwtConfig.enableRefreshToken) {
      result.refreshToken = this.jwtService.sign(payload, {
        expiresIn: jwtConfig.refreshExpiresIn,
      })
    }

    return result
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userService.findOneByUserName(username)
    console.log(user)
    if (!user) {
      throw new ApiException('用户不存在', ApiErrorCode.SERVER_ERROR)
    }
    if (user.password !== encryptData(password)) {
      throw new ApiException('密码错误', ApiErrorCode.SERVER_ERROR)
    }
    delete user.password
    return user
  }

  verifyToken(token: string) {
    const jwtConfig = this.configService.get('app.jwt')
    const payload = this.jwtService.verify(token, {
      secret: jwtConfig.secret,
    })
    return payload
  }

  async refreshToken(refreshToken: string) {
    try {
      const jwtConfig = this.configService.get('app.jwt')

      // 检查是否启用刷新token功能
      if (!jwtConfig.enableRefreshToken) {
        throw new ApiException(
          '刷新token功能未启用',
          ApiErrorCode.TOKEN_INVALID,
        )
      }

      const payload = this.jwtService.verify(refreshToken, {
        secret: jwtConfig.secret,
      })

      if (payload && payload.userId) {
        const user = await this.userService.findOne(payload.userId)
        if (user) {
          return this.generateToken(user)
        }
      }
      throw new ApiException('刷新令牌无效', ApiErrorCode.TOKEN_INVALID)
    } catch {
      throw new ApiException('刷新令牌已过期', ApiErrorCode.TOKEN_INVALID)
    }
  }

  /**
   * 退出登录
   * @param token 访问令牌
   * @returns 退出结果
   */
  logout(token: string) {
    try {
      // 验证token是否有效
      this.verifyToken(token)

      // 这里可以添加token黑名单逻辑
      // 例如：将token添加到Redis黑名单中
      // await this.redisService.set(`blacklist:${token}`, '1', jwtConfig.expiresIn)

      return '退出登录成功'
    } catch {
      throw new ApiException('token无效', ApiErrorCode.TOKEN_INVALID)
    }
  }

  /**
   * 获取当前用户信息
   * @param token 访问令牌
   * @returns 用户信息和角色信息
   */
  async getUserInfo(token: string) {
    try {
      // 验证并解析token
      const payload = this.verifyToken(token)

      if (!payload || !payload.userId) {
        throw new ApiException('token无效', ApiErrorCode.TOKEN_INVALID)
      }

      // 根据userId获取用户完整信息，包括角色和部门
      const user = await this.userService.findOne(payload.userId)

      if (!user) {
        throw new ApiException('用户不存在', ApiErrorCode.USER_NOTEXIST)
      }

      return user
    } catch (error) {
      if (error instanceof ApiException) {
        throw error
      }
      throw new ApiException('获取用户信息失败', ApiErrorCode.TOKEN_INVALID)
    }
  }
}
