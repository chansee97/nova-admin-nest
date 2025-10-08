import { User as UserEntity } from '@/modules/system/user/entities/user.entity'
import { Role as RoleEntity } from '@/modules/system/role/entities/role.entity'

export interface ClientInfo {
  ip?: string
  ua?: string
  browser?: string
  os?: string
  loginLocation?: string
}

export type Session = Partial<UserEntity> &
  ClientInfo & {
    permissions: string[]
    roles: RoleEntity[]
  }
