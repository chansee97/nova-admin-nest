import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import config from './config'

export { config }

export interface AppConfig {
  server: {
    port: number
    requestTimeoutMs?: number
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

export * from './app.config'
