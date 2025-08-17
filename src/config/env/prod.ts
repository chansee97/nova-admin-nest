import { SnakeCaseNamingStrategy } from '@/utils/naming-strategy'
import { AppConfig } from '../type'

const productionConfig: AppConfig = {
  server: {
    port: 3000,
  },
  database: {
    type: 'postgres',
    host: '192.168.80.128',
    port: 5432,
    username: 'root',
    password: '123456',
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
  },
  captcha: {
    enabled: true,
    expiresIn: 300, // 5分钟
    length: 4,
    type: 'math',
    caseSensitive: false,
  },
}

export default productionConfig
