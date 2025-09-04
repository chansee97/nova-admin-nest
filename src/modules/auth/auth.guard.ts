import type { CanActivate, ExecutionContext } from '@nestjs/common'
import type { Request } from 'express'
import { Injectable, HttpStatus } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthService } from './auth.service'
import { ApiErrorCode } from '@/common/enums'
import { ApiException } from '@/common/filters'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) {
      return true
    }

    const request: Request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)

    if (!token) {
      throw new ApiException(
        '未登录',
        ApiErrorCode.SERVER_ERROR,
        HttpStatus.UNAUTHORIZED,
      )
    }

    try {
      this.authService.verifyToken(token)
    } catch {
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
