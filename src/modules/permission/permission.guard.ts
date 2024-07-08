// permission.guard.ts
import type { CanActivate, ExecutionContext } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserService } from 'src/modules/user/user.service'
import { ApiException } from 'src/common/filters'
import { ApiErrorCode } from 'src/common/enum'
import type { Request } from 'express'
import { AuthService } from 'src/modules/auth/auth.service'

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userServicese: UserService,
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

    if (requiredPermissions.length === 0) return true
    const [, token] = request.headers.authorization?.split(' ') ?? []

    const info = this.authService.verifyToken(token)

    const permissionNames = await this.userServicese.findPermissionNames(
      info.username,
    )

    const isContainedPermission = requiredPermissions.every((item) =>
      permissionNames.includes(item),
    )
    if (!isContainedPermission)
      throw new ApiException('权限不足', ApiErrorCode.SERVER_ERROR)

    return true
  }
}
