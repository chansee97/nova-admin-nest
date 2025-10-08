import { Injectable, Inject } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import type { LoginAuthDto } from './dto/login-auth.dto'
import { UserService } from '@/modules/system/user/user.service'
import type { User } from '@/modules/system/user/entities/user.entity'
import { encryptData } from '@/utils/crypto'
import { ApiErrorCode } from '@/common/enums'
import { ApiException } from '@/common/filters'
import { CaptchaService } from './captcha.service'
import { LoginLogService } from '@/modules/monitor/login-log/login-log.service'
import { RedisService, REDIS_CLIENT } from '@/modules/common/redis'
import { RedisKey } from '@/common/enums'
import { ClientInfo } from '@/utils/client-info'
import { convertExpiresInToSeconds } from '@/utils'
import { config } from '@/config'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private captchaService: CaptchaService,
    private loginLogService: LoginLogService,
    @Inject(REDIS_CLIENT) private readonly redisService: RedisService,
  ) {}

  async login(loginAuthDto: LoginAuthDto, clientInfo: ClientInfo) {
    const { username, password, captchaId, captcha } = loginAuthDto

    // 验证验证码（如果启用）
    if (captchaId && captcha) {
      await this.captchaService.verifyCaptcha(captchaId, captcha)
    } else {
      // 如果验证码启用但未提供，则验证会在 verifyCaptcha 中处理
      await this.captchaService.verifyCaptcha(captchaId || '', captcha || '')
    }

    try {
      // 验证用户名密码
      const user = await this.validateUser(username, password)
      await this.loginLogService.create({
        username,
        status: 0,
        msg: '登录成功',
        ...clientInfo,
      })
      // 获取用户权限和角色
      const [permissions, roles] = await Promise.all([
        this.userService.findUserPermissions(user.id),
        this.userService.findUserRoles(user.id),
      ])

      // 创建会话数据
      const session = {
        ...user,
        ...clientInfo,
        permissions,
        roles,
      }

      // 将会话数据存入 Redis
      const sessionKey = `${RedisKey.USER_SESSION}${user.id}`
      // 将 jwt 的过期时间字符串转换为秒数
      const expiresInSeconds = convertExpiresInToSeconds(config.jwt.expiresIn)

      // 使用 access token 的过期时间作为 redis 的过期时间
      await this.redisService.set(sessionKey, session, expiresInSeconds)

      // 生成 Token
      return this.generateToken(user)
    } catch (error) {
      await this.loginLogService.create({
        username,
        status: 1,
        msg: error.message,
        ...clientInfo,
      })
      throw error
    }
  }

  generateToken(user: User) {
    const jwtConfig = config.jwt

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
    if (!user) {
      throw new ApiException('用户不存在', ApiErrorCode.SERVER_ERROR)
    }
    if (user.password !== encryptData(password)) {
      throw new ApiException('密码错误', ApiErrorCode.SERVER_ERROR)
    }
    delete user.password
    return user
  }

  async verifyToken(token: string) {
    try {
      if (!token) {
        throw new ApiException('token为空', ApiErrorCode.SERVER_ERROR)
      }

      const jwtConfig = config.jwt
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConfig.secret,
      })
      return payload
    } catch (error) {
      throw new ApiException(
        `token验证失败: ${error.message}`,
        ApiErrorCode.SERVER_ERROR,
      )
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const jwtConfig = config.jwt

      // 检查是否启用刷新token功能
      if (!jwtConfig.enableRefreshToken) {
        throw new ApiException('刷新token功能未启用', ApiErrorCode.SERVER_ERROR)
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
      throw new ApiException('刷新令牌无效', ApiErrorCode.SERVER_ERROR)
    } catch {
      throw new ApiException('刷新令牌已过期', ApiErrorCode.SERVER_ERROR)
    }
  }

  /**
   * 退出登录
   * @param token 访问令牌
   * @returns 退出结果
   */
  async logout(token: string) {
    try {
      // 验证token并获取payload
      const payload = await this.verifyToken(token)
      if (payload && payload.userId) {
        await this.redisService.del(`${RedisKey.USER_SESSION}${payload.userId}`)
      }

      return '退出登录成功'
    } catch {
      throw new ApiException('token无效', ApiErrorCode.SERVER_ERROR)
    }
  }

  /**
   * 获取当前用户信息
   * @param token 访问令牌
   * @returns 用户信息、菜单权限和角色权限
   */
  async getUserInfo(token: string) {
    try {
      // 验证并解析token
      const payload = await this.verifyToken(token)

      // 根据userId获取用户完整信息，包括角色和部门
      const user = await this.userService.findOne(payload.userId)

      if (!user) {
        throw new ApiException('用户不存在', ApiErrorCode.SERVER_ERROR)
      }

      // 获取用户的所有菜单权限
      const permissions = await this.userService.findUserPermissions(
        payload.userId,
      )

      return {
        ...user,
        permissions,
      }
    } catch (error) {
      if (error instanceof ApiException) {
        throw error
      }
      throw new ApiException('token验证失败', ApiErrorCode.SERVER_ERROR)
    }
  }

  /**
   * 获取当前用户菜单
   * @param token 访问令牌
   * @returns 用户有权限的菜单列表
   */
  async getUserMenus(token: string) {
    try {
      // 验证并解析token
      const payload = await this.verifyToken(token)
      if (!payload || !payload.userId) {
        throw new ApiException('token无效', ApiErrorCode.SERVER_ERROR)
      }

      // 获取用户的所有菜单
      const menus = await this.userService.findUserMenus(payload.userId)
      return menus
    } catch (error) {
      if (error instanceof ApiException) {
        throw error
      }
      throw new ApiException('token验证失败', ApiErrorCode.SERVER_ERROR)
    }
  }
}
