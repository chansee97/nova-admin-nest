import { TypeOrmModuleOptions } from '@nestjs/typeorm'

export interface AppConfig {
  server: {
    port: number
  }
  database: TypeOrmModuleOptions
  jwt: {
    secret: string
    expiresIn: string
    refreshExpiresIn: string
    enableRefreshToken: boolean
  }
  captcha: {
    enabled: boolean
    expiresIn: number
    size: number
    type: 'text' | 'math'
    caseSensitive: boolean
  }
}
