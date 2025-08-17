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
  }
  captcha: {
    enabled: boolean
    expiresIn: number
    length: number
    type: 'text' | 'math'
    caseSensitive: boolean
  }
}
