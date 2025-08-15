import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import configuration from './config/configuration'
/* 系统基础块 */
import { AuthModule } from './modules/auth/auth.module'
import { MenuModule } from './modules/menu/menu.module'
import { RoleModule } from './modules/role/role.module'
import { UserModule } from './modules/user/user.module'
import { DeptModule } from './modules/dept/dept.module'
import { DictModule } from './modules/dict/dict.module'
/* 辅助工具 */
import { getEnvFilePath } from './utils/env'

@Module({
  imports: [
    /* 全局环境变量 */
    ConfigModule.forRoot({
      envFilePath: getEnvFilePath(),
      load: [configuration],
      isGlobal: true,
    }),
    /* 数据库链接 */
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        return {
          type: config.get<string>('database.type') as any,
          host: config.get<string>('database.host'),
          port: config.get<number>('database.port'),
          username: config.get<string>('database.user'),
          password: config.get<string>('database.password'),
          database: config.get<string>('database.name'),
          synchronize: true, // 是否自动同步实体文件,生产环境建议关闭
          autoLoadEntities: true, // 自动加载实体
          logging: ['error', 'warn'], // 只显示错误和警告
        }
      },
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    RoleModule,
    MenuModule,
    DeptModule,
    DictModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
