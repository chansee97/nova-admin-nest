import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import appConfig from './config/app.config'
/* 系统基础块 */
import { AuthModule } from './modules/auth/auth.module'
import { SystemModule } from './modules/system/system.module'
/* 辅助工具 */
import { getEnvFilePath } from './utils/env'

@Module({
  imports: [
    /* 全局环境变量 */
    ConfigModule.forRoot({
      envFilePath: getEnvFilePath(),
      load: [() => ({ app: appConfig })],
      isGlobal: true,
    }),
    /* 数据库链接 */
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => config.get('app.database'),
      inject: [ConfigService],
    }),
    AuthModule,
    SystemModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
