import type { CanActivate, ExecutionContext } from '@nestjs/common'
import type { Request } from 'express'
import { Injectable, HttpStatus, Inject } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthService } from '@/modules/auth/auth.service'
import { RedisService, REDIS_CLIENT } from '@/modules/common/redis'
import { RedisKey } from '@/common/enums'
import { ApiErrorCode } from '@/common/enums'
import { ApiException } from '@/common/filters'

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
    @Inject(REDIS_CLIENT) private redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)

    if (!token) {
      throw new ApiException(
        '未登录',
        ApiErrorCode.SERVER_ERROR,
        HttpStatus.UNAUTHORIZED,
      )
    }

    try {
      const userInfo: any = await this.authService.verifyToken(token)

      // 从 Redis 获取会话信息
      const sessionKey = `${RedisKey.USER_SESSION}${userInfo.userId}`
      const session = await this.redisService.get<Session>(sessionKey)

      if (!session) {
        throw new ApiException(
          '用户会话已过期或不存在',
          ApiErrorCode.SERVER_ERROR,
          HttpStatus.UNAUTHORIZED,
        )
      }

      // 将会话中的用户信息附加到请求对象
      request.session = session
    } catch (error) {
      console.log('token验证失败:', error)
      throw new ApiException(
        'token验证失败',
        ApiErrorCode.SERVER_ERROR,
        HttpStatus.UNAUTHORIZED,
      )
    }

    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
