import { SnakeCaseNamingStrategy } from '@/utils/naming-strategy'
import { AppConfig } from '../type'

const developmentConfig: AppConfig = {
  server: {
    port: 3000,
  },
  database: {
    type: 'postgres',
    host: '127.0.0.1',
    port: 5432,
    username: 'root',
    password: 'postgres',
    database: 'nova_db',
    synchronize: true,
    autoLoadEntities: true,
    logging: ['error', 'warn'],
    namingStrategy: new SnakeCaseNamingStrategy(),
    extra: {
      timezone: '+08:00',
    },
  },
  jwt: {
    secret: 'secret-key',
    expiresIn: '24h',
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
}

export default developmentConfig
