import { registerAs } from '@nestjs/config'
import developmentConfig from './env/dev'
import productionConfig from './env/prod'

// 根据环境变量选择配置
export default registerAs('app', () => {
  const env = process.env.NODE_ENV

  switch (env) {
    case 'prod':
      return productionConfig
    case 'dev':
      return developmentConfig
    default:
      return developmentConfig
  }
})
