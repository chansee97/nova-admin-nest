import { SetMetadata } from '@nestjs/common'

export function Permissions(...permissions: string[]) {
  return SetMetadata('permissions', permissions)
}
