import { SnakeCaseNamingStrategy } from '@/utils/naming-strategy'
import { AppConfig } from '..'

const developmentConfig: AppConfig = {
  server: {
    port: 3000,
    requestTimeoutMs: 30000,
  },
  database: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'root',
    password: 'postgres',
    database: 'nova2',
    synchronize: true,
    autoLoadEntities: true,
    logging: ['error', 'warn'],
    namingStrategy: new SnakeCaseNamingStrategy(),
    retryAttempts: 10,
    retryDelay: 3000,
    extra: {
      timezone: '+08:00',
    },
  },
  jwt: {
    secret: 'secret-key',
    expiresIn: '7d',
    refreshExpiresIn: '7d',
    enableRefreshToken: false,
  },
  captcha: {
    enabled: true,
    expiresIn: 300, // 5分钟
    size: 4,
    type: 'math',
    caseSensitive: false,
  },
  redis: {
    host: '127.0.0.1',
    port: 6379,
    password: '',
    db: 0,
  },
}

export default developmentConfig
