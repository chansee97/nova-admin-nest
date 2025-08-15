// permission.guard.ts
import type { CanActivate, ExecutionContext } from '@nestjs/common'
import type { Request } from 'express'
import { Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthService } from '@/modules/auth/auth.service'
import { UserService } from '@/modules/user/user.service'
import { ApiErrorCode } from 'src/common/enum'
import { ApiException } from 'src/common/filters'

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    interface CusRequest extends Request {
      user?: any
    }
    const request: CusRequest = context.switchToHttp().getRequest()

    const requiredPermissions =
      this.reflector.getAllAndOverride<string[]>('permissions', [
        context.getClass(),
        context.getHandler(),
      ]) || []

    if (requiredPermissions.length === 0) {
      return true
    }
    const [, token] = request.headers.authorization?.split(' ') ?? []

    const info = this.authService.verifyToken(token)

    const permissionNames = await this.userService.findPermissionNames(
      info.username,
    )

    const isContainedPermission = requiredPermissions.every(item =>
      permissionNames.includes(item),
    )
    if (!isContainedPermission) {
      throw new ApiException('权限不足', ApiErrorCode.SERVER_ERROR)
    }

    return true
  }
}
