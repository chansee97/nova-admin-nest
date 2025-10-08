import type { CanActivate, ExecutionContext } from '@nestjs/common'
import type { Request } from 'express'
import { Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ApiErrorCode } from '@/common/enums'
import { ApiException } from '@/common/filters'
import { Role } from '../../modules/system/role/entities/role.entity'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest<Request>()

    // 获取所需的权限和角色
    const requiredPermissions =
      this.reflector.getAllAndOverride<string[]>('permissions', [
        context.getClass(),
        context.getHandler(),
      ]) || []

    const requiredRoles =
      this.reflector.getAllAndOverride<string[]>('roles', [
        context.getClass(),
        context.getHandler(),
      ]) || []

    // 如果没有权限和角色要求，直接通过
    if (requiredPermissions.length === 0 && requiredRoles.length === 0) {
      return true
    }

    const session = request.session

    if (!session) {
      throw new ApiException(
        '用户会话已过期或不存在',
        ApiErrorCode.SERVER_ERROR,
      )
    }

    const { permissions, roles } = session

    // 检查是否有超级管理员权限（兼容 roles 为字符串数组或 Role 实体数组）
    const hasSuperAdminPermission = roles.some(
      (role: Role) => role.roleKey === 'admin',
    )

    if (hasSuperAdminPermission) return true

    // 检查权限
    let hasRequiredPermissions = true
    if (requiredPermissions.length > 0) {
      hasRequiredPermissions = requiredPermissions.every(item =>
        permissions.includes(item),
      )
    }

    // 检查角色（兼容 roles 为字符串数组或 Role 实体数组）
    let hasRequiredRoles = true
    if (requiredRoles.length > 0) {
      hasRequiredRoles = requiredRoles.some(roleKey =>
        roles.some((role: Role) => role.roleKey === roleKey),
      )
    }

    // 权限和角色都必须满足
    if (!hasRequiredPermissions) {
      throw new ApiException('权限不足', ApiErrorCode.SERVER_ERROR)
    }

    if (!hasRequiredRoles) {
      throw new ApiException('角色权限不足', ApiErrorCode.SERVER_ERROR)
    }

    return true
  }
}
