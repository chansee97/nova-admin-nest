import { registerAs } from '@nestjs/config'
import { AppConfig } from './type'
import developmentConfig from './env/dev'
import productionConfig from './env/prod'

// 根据环境变量选择配置
function getConfig(): AppConfig {
  const env = process.env.NODE_ENV

  switch (env) {
    case 'prod':
      return productionConfig
    case 'dev':
      return developmentConfig
    default:
      return developmentConfig
  }
}

export default registerAs('app', getConfig)
