import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { RedisOptions } from 'ioredis'
import config from './config'
import type { StringValue } from 'ms'
export { config }

export interface AppConfig {
  server: {
    port: number
    requestTimeoutMs?: number
  }
  database: TypeOrmModuleOptions
  jwt: {
    secret: string
    expiresIn: StringValue
    refreshExpiresIn: StringValue
    enableRefreshToken: boolean
  }
  captcha: {
    enabled: boolean
    expiresIn: number
    size: number
    type: 'text' | 'math'
    caseSensitive: boolean
  }
  redis: RedisOptions
}

export * from './app.config'
