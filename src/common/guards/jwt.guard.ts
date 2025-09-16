import type { CanActivate, ExecutionContext } from '@nestjs/common'
import type { Request } from 'express'
import { Injectable, HttpStatus } from '@nestjs/common'

interface AuthenticatedRequest extends Request {
  user?: any
}
import { Reflector } from '@nestjs/core'
import { AuthService } from '@/modules/auth/auth.service'
import { UserService } from '@/modules/system/user/user.service'
import { ApiErrorCode } from '@/common/enums'
import { ApiException } from '@/common/filters'

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) {
      return true
    }

    const request: AuthenticatedRequest = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)

    if (!token) {
      throw new ApiException(
        '未登录',
        ApiErrorCode.SERVER_ERROR,
        HttpStatus.UNAUTHORIZED,
      )
    }

    try {
      const userInfo = this.authService.verifyToken(token)

      // 获取用户的权限、角色和基础信息
      const [permissions, roles, user] = await Promise.all([
        this.userService.findUserPermissions(userInfo.userId),
        this.userService.findUserRoles(userInfo.userId),
        this.userService.findOne(userInfo.userId),
      ])

      // 直接将完整的用户对象设置到请求对象，同时合并权限与角色
      request.user = { ...user, permissions, roles }
    } catch {
      throw new ApiException(
        'token验证失败',
        ApiErrorCode.SERVER_ERROR,
        HttpStatus.UNAUTHORIZED,
      )
    }

    return true
  }

  private extractTokenFromHeader(
    request: AuthenticatedRequest,
  ): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
