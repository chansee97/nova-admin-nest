import { SetMetadata } from '@nestjs/common'

export interface AuthOptions {
  permissions?: string[]
  roles?: string[]
  isPublic?: boolean
}

export function Auth(options: AuthOptions) {
  return function (
    target: any,
    propertyKey?: string,
    descriptor?: PropertyDescriptor,
  ) {
    if (options.permissions) {
      SetMetadata('permissions', options.permissions)(
        target,
        propertyKey,
        descriptor,
      )
    }
    if (options.roles) {
      SetMetadata('roles', options.roles)(target, propertyKey, descriptor)
    }
    if (options.isPublic) {
      SetMetadata('isPublic', true)(target, propertyKey, descriptor)
    }
  }
}

// 便捷方法，只检查权限
export function RequirePermissions(...permissions: string[]) {
  return Auth({ permissions })
}

// 便捷方法，只检查角色
export function RequireRoles(...roles: string[]) {
  return Auth({ roles })
}

// 便捷方法，同时检查权限和角色
export function RequireAuth(permissions: string[], roles: string[]) {
  return Auth({ permissions, roles })
}

// 便捷方法，标记为公开接口
export function Public() {
  return Auth({ isPublic: true })
}
